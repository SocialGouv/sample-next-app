import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { hash } from "argon2";
import { createErrorFor } from "../../../src/lib/apiError";
import { graphqlClient } from "../../../src/lib/graphqlClient";
import { activateUserMutation } from "./activate.gql";

export function createRequestHandler({
  mutation,
  error_message = "error",
  success_message = "success",
}) {
  return async function (req, res) {
    const apiError = createErrorFor(res);

    if (req.method === "GET") {
      res.setHeader("Allow", ["POST"]);
      return apiError(Boom.methodNotAllowed("GET method not allowed"));
    }

    const schema = Joi.object({
      token: Joi.string().guid({ version: "uuidv4" }).required(),
      password: Joi.string().required().min(8),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return apiError(Boom.badRequest(error.details[0].message));
    }

    let hasura_data;
    try {
      hasura_data = await graphqlClient.request(mutation, {
        secret_token: value.token,
        password: await hash(value.password),
        now: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      return apiError(Boom.unauthorized("Invalid secret_token"));
    }

    if (hasura_data["update_user"].affected_rows === 0) {
      return apiError(Boom.unauthorized(error_message));
    }

    console.log("[set password]", value.token);

    res.json(success_message);
  };
}

export default createRequestHandler({
  mutation: activateUserMutation,
  errorMessage:
    "Account is already activated, the secret token has expired or there is no account.",
  success_message: "user activated !",
});
