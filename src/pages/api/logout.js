import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { createErrorFor } from "../../../src/lib/apiError";
import { graphqlClient } from "../../../src/lib/graphqlClient";

export default async function logout(req, res) {
  const apiError = createErrorFor(res);

  const schema = Joi.object().keys({
    refresh_token: Joi.string().guid({ version: "uuidv4" }),
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

  // delete refresh token passed in data

  try {
    await graphqlClient.request(mutation, {
      refresh_token: refresh_token,
    });
  } catch (e) {
    console.error(e);
    // let this error pass. Just log out the user by sending https status code 200 back
  }

  res.json("user logout !");
}

const mutation = `mutation  deleteRefreshToken(
  $refresh_token: uuid!,
) {
  delete_refresh_token: delete_auth_refresh_tokens (
    where: {
      refresh_token: { _eq: $refresh_token }
    }) {
    affected_rows
  }
}
`;
