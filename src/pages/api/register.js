import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { hash } from "argon2";
import { createErrorFor } from "src/lib/apiError";
import { getExpiryDate } from "src/lib/duration";
import { graphqlClient } from "src/lib/graphqlClient";
import { verifyJwtToken } from "src/lib/jwt";

export default async function register(req, res) {
  const apiError = createErrorFor(res);

  try {
    verifyJwtToken(req.headers.authorization);
  } catch (e) {
    console.error(e);
    if (e.type === "badRequest") {
      return apiError(Boom.badRequest(e.message));
    }
    return apiError(Boom.unauthorized(e.message));
  }

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }

  const { email, name } = value;

  // create user account
  const mutation = `
  mutation (
    $user: auth_users_insert_input!
  ) {
    insert_auth_users (
      objects: [$user]
    ) {
      affected_rows
    }
  }
  `;

  // create user and user_account in same mutation
  try {
    await graphqlClient.request(mutation, {
      user: {
        name,
        email,
        password: await hash(new Date().toISOString()),
        user_roles: { data: [{ role: "user" }] },
        secret_token_expires_at: getExpiryDate(
          parseInt(process.env.ACTIVATION_TOKEN_EXPIRES, 10) || 10080
        ),
      },
    });
  } catch (error) {
    console.error(error);
    return apiError(Boom.badImplementation("Unable to create user."));
  }
  console.log("[register]", name, email);
  res.json("user created !");
}
