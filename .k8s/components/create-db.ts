import env from "@kosko/env";
import { ok } from "assert";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { Job } from "kubernetes-models/batch/v1/Job";
import { Secret } from "kubernetes-models/v1/Secret";

const params = env.component("create-db");

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");

// todo ?
const PG_HOST = `${process.env.CI_PROJECT_NAME.replace(
  /-/g,
  ""
)}devserver.postgres.database.azure.com`;

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
    name: `create-azure-db-${process.env.CI_COMMIT_SHORT_SHA}`,
  },
  spec: {
    backoffLimit: 0,
    template: {
      metadata: {
        ...metadataFromParams(params),
      },
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
                value: params.dbName,
              },
              {
                name: "NEW_PASSWORD",
                value: params.dbPassword,
              },
              {
                name: "NEW_USER",
                value: params.dbUser,
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

// crerate the azure-pg-user secret for dynamic environements (dev)
const secret = new Secret({
  metadata: {
    ...metadataFromParams(params),
    name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
  },
  stringData: {
    DATABASE_URL: `postgresql://${params.dbUser}%40${PG_HOST}:${params.dbPassword}@${PG_HOST}/${params.dbName}?sslmode=require`.toString(),
    HASURA_GRAPHQL_DATABASE_URL: `postgresql://${params.dbUser}%40${PG_HOST}:${params.dbPassword}@${PG_HOST}/${params.dbName}?sslmode=require`.toString(),
    PGDATABASE: params.dbName,
    PGHOST: PG_HOST,
    PGPASSWORD: params.dbPassword,
    PGSSLMODE: "require",
    PGUSER: `${params.dbUser}@${PG_HOST}`,
  },
});

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(secret);
  defaultExport.push(job);
}
export default defaultExport;
