import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { v4 as uuidv4 } from "uuid";
import { ACTIVATION_TOKEN_EXPIRES } from "../../../src/config";
import { createErrorFor } from "../../../src/lib/apiError";
import { getExpiryDate } from "../../../src/lib/duration";
import { graphqlClient } from "../../../src/lib/graphqlClient";

export default async function reset_password(req, res) {
  const apiError = createErrorFor(res);

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object().keys({
    email: Joi.string().email(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }

  const { email } = value;

  let hasura_data;

  try {
    hasura_data = await graphqlClient.request(udpateSecretTokenMutation, {
      email,
      secret_token: uuidv4(),
      expires: getExpiryDate({ minutes: ACTIVATION_TOKEN_EXPIRES }),
    });
    console.log(hasura_data);
    console.log(hasura_data["update_user"].affected_rows);
  } catch (error) {
    // silently fail to not disclose if user exists or not
    console.error(error);
  }
  res.json("ok!");
}

const udpateSecretTokenMutation = `
mutation updateSecretTokenMutation(
  $email: citext!,
  $expires: timestamptz!,
  $secret_token: uuid
) {
  update_user: update_users(
    where: {
      _and: {
        email: { _eq: $email} ,
      }
  	}
    _set: {
    	secret_token_expires_at: $expires
      secret_token: $secret_token
  	}
  ){
    affected_rows
  }
}
`;
