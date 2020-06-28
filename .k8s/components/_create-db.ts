import env from "@kosko/env";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { Job } from "kubernetes-models/batch/v1/Job";
import { Secret } from "kubernetes-models/v1/Secret";
import { CreateDbEnvironment } from "index";

const params = env.component("createDb");

// todo ?
const PG_HOST = "samplenextappdevserver.postgres.database.azure.com";

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
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
                  name: `azure-pg-admin-user-${process.env.CI_COMMIT_SHORT_SHA}`,
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
    PGDATABASE: params.dbName,
    PGHOST: PG_HOST,
    PGPASSWORD: params.dbPassword,
    PGSSLMODE: "require",
    PGUSER: params.dbUser,
  },
});

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(secret);
  defaultExport.push(job);
}
export default defaultExport;
