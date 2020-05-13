import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { verify } from "argon2";
import cookie from "cookie";
import { createErrorFor } from "../../../src/lib/apiError";
import { getExpiryDate } from "../../../src/lib/duration";
import { graphqlClient } from "../../../src/lib/graphqlClient";
import { generateJwtToken } from "../../../src/lib/jwt";
import { loginQuery, refreshTokenMutation } from "./login.gql";

export default async function login(req, res) {
  const apiError = createErrorFor(res);

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }
  // validate username and password
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return apiError(Boom.badRequest(error.details[0].message));
  }

  const { username, password } = value;

  let hasura_data;
  try {
    hasura_data = await graphqlClient.request(loginQuery, {
      username,
    });
  } catch (e) {
    console.error(e);
    // console.error('Error connection to GraphQL');
    return apiError(Boom.unauthorized("Unable to find 'user'"));
  }

  if (hasura_data.users.length === 0) {
    // console.error("No user with this 'username'");
    return apiError(Boom.unauthorized("Invalid 'username' or 'password'"));
  }

  // check if we got any user back
  const user = hasura_data[`users`][0];

  if (!user.active) {
    // console.error('User not activated');
    return apiError(Boom.unauthorized("User not activated."));
  }

  // see if password hashes matches
  const match = await verify(user.password, password);

  if (!match) {
    console.error("Password does not match");
    return apiError(Boom.unauthorized("Invalid 'username' or 'password'"));
  }

  const jwt_token = generateJwtToken(user);
  try {
    hasura_data = await graphqlClient.request(refreshTokenMutation, {
      refresh_token_data: {
        user_id: user.id,
        expires_at: getExpiryDate(process.env.REFRESH_TOKEN_EXPIRES || 43200),
      },
    });
  } catch (e) {
    console.error(e);
    return apiError(
      Boom.badImplementation("Could not update 'refresh token' for user")
    );
  }
  console.log("[login]", user.id);
  const { refresh_token } = hasura_data.insert_data.returning[0];

  // return jwt token and refresh token to client
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", refresh_token, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: (process.env.REFRESH_TOKEN_EXPIRES || 43200) * 60, // maxAge in second
      httpOnly: true,
      path: "/",
    })
  );

  res.json({
    refresh_token,
    jwt_token,
    jwt_token_expiry: parseInt(process.env.JWT_TOKEN_EXPIRES, 10) || 15,
  });
}
