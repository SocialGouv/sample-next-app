import env from "@kosko/env";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { Job } from "kubernetes-models/batch/v1/Job";

const params = env.component("create-db");

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
    name: `drop-azure-db-${process.env.CI_COMMIT_SHORT_SHA}`,
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
            name: "drop-db-user",
            image:
              "registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:0.28.0",
            imagePullPolicy: "IfNotPresent",
            command: ["drop-db-user"],
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
                name: "DROP_DATABASE",
                value: params.dbName,
              },
              {
                name: "DROP_USER",
                value: params.dbUser,
              },
            ],
          },
        ],
      },
    },
  },
});

export default [job];
