import { config } from "dotenv";

config();

export const HASURA_GRAPHQL_ENDPOINT =
  process.env.HASURA_GRAPHQL_ENDPOINT || "http://localhost:8080/v1/graphql";
export const HASURA_GRAPHQL_JWT_SECRET = process.env.HASURA_GRAPHQL_JWT_SECRET
  ? JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET)
  : {
      type: "HS256",
      key:
        "3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R",
    };

// default expires after 15 m
export const JWT_TOKEN_EXPIRES = process.env.JWT_TOKEN_EXPIRES || 15;

// default expires after 30 days
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

// default expires after  7 days
export const ACTIVATION_TOKEN_EXPIRES = process.env.ACTIVATION_TOKEN_EXPIRES;

export const ACCOUNT_EMAIL_SECRET = process.env.ACCOUNT_EMAIL_SECRET;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const ACCOUNT_MAIL_SENDER = process.env.ACCOUNT_MAIL_SENDER;
