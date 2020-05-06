import jwt from "jsonwebtoken";
import { HASURA_GRAPHQL_JWT_SECRET, JWT_TOKEN_EXPIRES } from "../config";

export function generateJwtToken(user) {
  const user_roles = user.roles.map((role) => {
    return role.role;
  });
  if (!user_roles.includes(user.default_role)) {
    user_roles.push(user.default_role);
  }
  return jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": user_roles,
        "x-hasura-default-role": user.default_role,
        "x-hasura-user-id": user.id.toString(),
      },
    },
    HASURA_GRAPHQL_JWT_SECRET.key,
    {
      algorithm: HASURA_GRAPHQL_JWT_SECRET.type,
      expiresIn: `${JWT_TOKEN_EXPIRES}m`,
    }
  );
}
