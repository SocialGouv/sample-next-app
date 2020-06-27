import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { Job } from "kubernetes-models/batch/v1/Job";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("create-db");

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
    name: params.jobName,
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

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(job);
}
export default defaultExport;
