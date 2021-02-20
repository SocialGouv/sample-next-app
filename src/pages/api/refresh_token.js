import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { createErrorFor } from "src/lib/apiError";
import { getExpiryDate } from "src/lib/duration";
import { graphqlClient } from "src/lib/graphqlClient";
import { generateJwtToken } from "src/lib/jwt";
import { setRefreshTokenCookie } from "src/lib/setRefreshTokenCookie";
import { v4 as uuidv4 } from "uuid";

import {
  deletePreviousRefreshTokenMutation,
  getRefreshTokenQuery,
} from "./refreshToken.gql";

export default async function refresh_token(req, res) {
  const apiError = createErrorFor(res);
  const schema = Joi.object({
    refresh_token: Joi.string().guid({ version: "uuidv4" }).required(),
  }).unknown();

  let { error, value } = schema.validate(req.query);

  if (error) {
    const temp = schema.validate(req.body);
    error = temp.error;
    value = temp.value;
  }

  if (error) {
    const temp = schema.validate(req.cookies);
    error = temp.error;
    value = temp.value;
  }

  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }
  const { refresh_token } = value;
  let hasura_data;
  try {
    hasura_data = await graphqlClient.request(getRefreshTokenQuery, {
      current_timestampz: new Date(),
      refresh_token,
    });
  } catch (e) {
    console.error(e);
    console.error("Error connecting to GraphQL");
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }

  if (hasura_data.refresh_tokens.length === 0) {
    console.error("Incorrect user id or refresh token", refresh_token);
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }

  const { user } = hasura_data[`refresh_tokens`][0];

  const new_refresh_token = uuidv4();

  console.log("[ /api/refresh_token ]", "replace", {
    new_refresh_token,
    refresh_token,
  });

  try {
    await graphqlClient.request(deletePreviousRefreshTokenMutation, {
      new_refresh_token_data: {
        expires_at: getExpiryDate(process.env.REFRESH_TOKEN_EXPIRES),
        refresh_token: new_refresh_token,
        user_id: user.id,
      },
      old_refresh_token: refresh_token,
    });
  } catch (e) {
    console.error(e);
    console.error("unable to create new refresh token and delete old");
    return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
  }
  const jwt_token = generateJwtToken(user);

  setRefreshTokenCookie(res, new_refresh_token);

  res.json({
    jwt_token,
    jwt_token_expiry: parseInt(process.env.JWT_TOKEN_EXPIRES, 10) || 15,
    refresh_token: new_refresh_token,
    user_id: user.id,
  });
}
