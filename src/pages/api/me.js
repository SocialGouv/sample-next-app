import Boom from "@hapi/boom";
import { createErrorFor } from "../../../src/lib/apiError";
import { graphqlClient } from "../../../src/lib/graphqlClient";
import { verifyJwtToken } from "../../lib/jwt";

export default async function me(req, res) {
  const apiError = createErrorFor(res);
  // verify jwt token is OK
  let claims;
  try {
    claims = verifyJwtToken(req.headers.authorization);
  } catch (e) {
    console.error(e);
    if (e.type === "badRequest") {
      return apiError(Boom.badRequest(e.message));
    }
    return apiError(Boom.unauthorized(e.message));
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
