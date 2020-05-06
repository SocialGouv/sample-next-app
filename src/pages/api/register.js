import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { hash } from "argon2";
import { ACTIVATION_TOKEN_EXPIRES } from "../../../src/config";
import { createErrorFor } from "../../../src/lib/apiError";
import { getExpiryDate } from "../../../src/lib/duration";
import { graphqlClient } from "../../../src/lib/graphqlClient";

export default async function register(req, res) {
  const apiError = createErrorFor(res);

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object().keys({
    email: Joi.string().email(),
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
        secret_token_expires_at: getExpiryDate({
          minutes: ACTIVATION_TOKEN_EXPIRES,
        }),
      },
    });
  } catch (error) {
    console.error(error);
    return apiError(Boom.badImplementation("Unable to create user."));
  }

  res.json("user created !");
}
