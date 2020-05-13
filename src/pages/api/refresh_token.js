import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";
import { createErrorFor } from "../../../src/lib/apiError";
import { getExpiryDate } from "../../../src/lib/duration";
import { graphqlClient } from "../../../src/lib/graphqlClient";
import { generateJwtToken } from "../../../src/lib/jwt";
import {
  deletePreviousRefreshTokenMutation,
  getRefreshTokenQuery,
} from "./refreshToken.gql";

export default async function refresh_token(req, res) {
  const apiError = createErrorFor(res);
  const schema = Joi.object({
    refresh_token: Joi.string().guid({ version: "uuidv4" }).required(),
  });

  let { error, value } = schema.validate(req.cookies);

  if (error) {
    res = schema.validate(req.body);
    error = res.error;
    value = res.value;
  }

  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }

  const { refresh_token } = value;
  let hasura_data;
  try {
    hasura_data = await graphqlClient.request(getRefreshTokenQuery, {
      refresh_token,
      current_timestampz: new Date(),
    });
  } catch (e) {
    console.error(e);
    console.error("Error connecting to GraphQL");
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }

  if (hasura_data.refresh_tokens.length === 0) {
    console.error("Incorrect user id or refresh token");
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }
  const { user } = hasura_data[`refresh_tokens`][0];

  const new_refresh_token = uuidv4();

  try {
    await graphqlClient.request(deletePreviousRefreshTokenMutation, {
      old_refresh_token: refresh_token,
      new_refresh_token_data: {
        user_id: user.id,
        refresh_token: new_refresh_token,
        expires_at: getExpiryDate(process.env.REFRESH_TOKEN_EXPIRES),
      },
    });
  } catch (e) {
    console.error(e);
    console.error("unable to create new refresh token and delete old");
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }

  const jwt_token = generateJwtToken(user);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", new_refresh_token, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: (process.env.REFRESH_TOKEN_EXPIRES || 43200) * 60, // maxAge in second
      httpOnly: true,
      path: "/",
    })
  );
  res.json({
    refresh_token: new_refresh_token,
    jwt_token,
    jwt_token_expiry: parseInt(process.env.JWT_TOKEN_EXPIRES, 10) || 15,
  });
}
