import { GraphQLClient } from "graphql-request";

const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const HASURA_GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

export const graphqlClient = new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET,
  },
});
