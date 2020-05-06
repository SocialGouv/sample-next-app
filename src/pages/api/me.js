import Boom from "@hapi/boom";
import { verify } from "jsonwebtoken";
import { HASURA_GRAPHQL_JWT_SECRET } from "../../../src/config";
import { createErrorFor } from "../../../src/lib/apiError";
import { graphqlClient } from "../../../src/lib/graphqlClient";

export default async function me(req, res) {
  const apiError = createErrorFor(res);
  if (!req.headers.authorization) {
    return apiError(Boom.badRequest("no authorization header"));
  }

  const auth_split = req.headers.authorization.split(" ");

  if (auth_split[0] !== "Bearer" || !auth_split[1]) {
    return apiError(Boom.badRequest("malformed authorization header"));
  }

  // get jwt token
  const token = auth_split[1];

  // verify jwt token is OK
  let claims;
  try {
    claims = verify(token, HASURA_GRAPHQL_JWT_SECRET.key, {
      algorithms: HASURA_GRAPHQL_JWT_SECRET.type,
    });
  } catch (e) {
    console.error(e);
    return apiError(Boom.unauthorized("Incorrect JWT Token"));
  }

  // get user_id from jwt claim
  const user_id = claims["https://hasura.io/jwt/claims"]["x-hasura-user-id"];

  let hasura_data;
  try {
    hasura_data = await graphqlClient.request(getUserQuery, {
      id: user_id,
    });
  } catch (e) {
    console.error(e);
    return apiError(Boom.unauthorized("Unable to get 'user'"));
  }
  if (hasura_data.user.length !== 1) {
    return apiError(Boom.unauthorized("Unable to get 'user'"));
  }
  // return user as json response
  res.json({
    user: hasura_data.user[0],
  });
}

// get user from hasura
const getUserQuery = `
query getUser($id: uuid!) {
  user: users(where: {id:{_eq: $id}}) {
    id
    email
    name
    active
    default_role
    roles {
      role
    }
  }
}
`;
