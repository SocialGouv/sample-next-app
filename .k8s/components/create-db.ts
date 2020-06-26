import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { Job } from "kubernetes-models/batch/v1/Job";

const params = env.component("create-db");

// image: registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
    name: "create-db-user",
  },
  spec: {
    backoffLimit: 0,
    template: {
      metadata: {
        ...metadataFromParams(params),
      },
      spec: {
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
                  name: "azure-pg-admin-user",
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
            ],
          },
        ],
        restartPolicy: "Never",
      },
    },
  },
});
// deployment.spec!.template.spec!.containers[0].envFrom = [
//   {
//     configMapRef: { name: `${params.name}-env` },
//   },
// ];

//

export default [job];
