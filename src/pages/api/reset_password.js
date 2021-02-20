import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { createErrorFor } from "src/lib/apiError";
import { getExpiryDate } from "src/lib/duration";
import { graphqlClient } from "src/lib/graphqlClient";
import { v4 as uuidv4 } from "uuid";

export default async function reset_password(req, res) {
  const apiError = createErrorFor(res);

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return apiError(Boom.badRequest(error.details[0].message));
  }

  const { email } = value;

  try {
    await graphqlClient.request(udpateSecretTokenMutation, {
      email,
      expires: getExpiryDate(process.env.ACTIVATION_TOKEN_EXPIRES || 10080),
      secret_token: uuidv4(),
    });
  } catch (error) {
    // silently fail to not disclose if user exists or not
    console.error(error);
  }

  console.log("[reset_password]", email);

  res.json({ message: "reset password started" });
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
