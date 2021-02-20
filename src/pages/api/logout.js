import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import cookie from "cookie";

import { createErrorFor } from "../../../src/lib/apiError";
import { graphqlClient } from "../../../src/lib/graphqlClient";

export default async function logout(req, res) {
  const apiError = createErrorFor(res);

  const schema = Joi.object({
    refresh_token: Joi.string().guid({ version: "uuidv4" }).required(),
  }).unknown();

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
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", "deleted", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );
  console.log("[logout]", refresh_token);
  res.json({ message: "user logout !" });
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
