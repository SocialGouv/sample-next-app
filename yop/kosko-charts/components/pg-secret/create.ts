import { Secret } from "kubernetes-models/v1/Secret";

import { metadataFromParams } from "../app/metadata";
import { Params } from "./params";

// create the azure-pg-user secret for dynamic environments (dev)
export const createSecret = ({
  database,
  user,
  password,
  host,
  sslmode = "require",
  ...params
}: Params): Secret => {
  const connectionString = `postgresql://${user}%40${host}:${password}@${host}/${database}?sslmode=require`.toString();
  const secret = new Secret({
    metadata: {
      ...metadataFromParams(params),
    },
    stringData: {
      DATABASE_URL: connectionString,
      HASURA_GRAPHQL_DATABASE_URL: connectionString,
      PGDATABASE: database,
      PGHOST: host,
      PGPASSWORD: password,
      PGSSLMODE: sslmode,
      PGUSER: `${user}@${host}`,
    },
  });
  return secret;
};
