import env from "@kosko/env";
import { ok } from "assert";

import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { Job } from "kubernetes-models/batch/v1/Job";
import { Secret } from "kubernetes-models/v1/Secret";

const params = env.component("create-db");

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");
ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

type EnvironmentName = "dev" | "preprod" | "prod";

// dummy slugify - use "dev" server for "preprod" env too
const getPgServerHostName = (
  appName: string,
  env: EnvironmentName = "dev"
): string =>
  appName.toLowerCase().replace(/\W/g, "") +
  (env === "preprod" ? "dev" : env) +
  "server.postgres.database.azure.com";

const PG_HOST = getPgServerHostName(process.env.CI_PROJECT_NAME, "dev");

type CreateDbJobParameters = {
  database: string;
  user: string;
  password: string;
};

// needs azure-pg-admin-user secret
const getCreateDbJob = ({
  database,
  user,
  password,
}: CreateDbJobParameters) => {
  const job = new Job({
    spec: {
      backoffLimit: 0,
      template: {
        spec: {
          restartPolicy: "Never",
          containers: [
            {
              name: "create-db-user",
              image:
                "registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:0.28.0",
              imagePullPolicy: "IfNotPresent",
              command: ["create-db-user"],
              resources: {
                limits: {
                  cpu: "300m",
                  memory: "256Mi",
                },
                requests: {
                  cpu: "100m",
                  memory: "64Mi",
                },
              },
              envFrom: [
                {
                  secretRef: {
                    name: `azure-pg-admin-user`,
                  },
                },
              ],
              env: [
                {
                  name: "NEW_DB_NAME",
                  value: database,
                },
                {
                  name: "NEW_USER",
                  value: user,
                },
                {
                  name: "NEW_PASSWORD",
                  value: password,
                },
                {
                  name: "NEW_DB_EXTENSIONS",
                  value: "pgcrypto hstore citext",
                },
              ],
            },
          ],
        },
      },
    },
  });
  return job;
};

const job = getCreateDbJob({
  database: params.database,
  user: params.user,
  password: params.password,
});

job.metadata = {
  ...metadataFromParams(params),
  name: `create-azure-db-${process.env.CI_COMMIT_SHORT_SHA}`,
};

type PostgresSecretParameters = {
  database: string;
  user: string;
  password: string;
  host: string;
  sslmode?: string;
};

// create the azure-pg-user secret for dynamic environments (dev)
const getUserPostgresSecret = ({
  database,
  user,
  password,
  host,
  sslmode = "require",
}: PostgresSecretParameters) => {
  const connectionString = `postgresql://${user}%40${host}:${password}@${host}/${database}?sslmode=require`.toString();
  const secret = new Secret({
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

const secret = getUserPostgresSecret({
  database: params.database,
  user: params.user,
  password: params.password,
  host: PG_HOST,
});

secret.metadata = {
  ...metadataFromParams(params),
  name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
};

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(secret);
  defaultExport.push(job);
}
export default defaultExport;
