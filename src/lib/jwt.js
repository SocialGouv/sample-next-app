import jwt, { verify } from "jsonwebtoken";

const { HASURA_GRAPHQL_JWT_SECRET, JWT_TOKEN_EXPIRES = 15 } = process.env;
const jwtSecret = JSON.parse(HASURA_GRAPHQL_JWT_SECRET);

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
    jwtSecret.key,
    {
      algorithm: jwtSecret.type,
      expiresIn: `${JWT_TOKEN_EXPIRES}m`,
    }
  );
}

export function verifyJwtToken(authorizationHeader) {
  if (!authorizationHeader) {
    throw { message: "no authorization header", type: "badRequest" };
  }

  const auth_split = authorizationHeader.toString().split(" ");

  if (auth_split[0] !== "Bearer" || !auth_split[1]) {
    throw { message: "malformed authorization header", type: "badRequest" };
  }

  // get jwt token
  const token = auth_split[1];

  // verify jwt token is OK
  let claims;
  try {
    claims = verify(token, jwtSecret.key, { algorithms: jwtSecret.type });
  } catch (e) {
    console.error(e);
    throw { message: "Incorrect JWT Token", type: "unauthorized" };
  }

  return claims;
}
