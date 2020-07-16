import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { Job } from "kubernetes-models/batch/v1/Job";

import { Params } from "./params";

const DEFAULT_EXTENSIONS = "hstore pgcrypto citext";

// needs azure-pg-admin-user secret
export const createDbJob = ({
  database,
  user,
  password,
  extensions = DEFAULT_EXTENSIONS,
  ...params
}: Params): Job => {
  const job = new Job({
    metadata: {
      ...metadataFromParams(params),
    },
    spec: {
      backoffLimit: 0,
      template: {
        spec: {
          containers: [
            {
              command: ["create-db-user"],
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
                  value: extensions,
                },
              ],
              envFrom: [
                {
                  secretRef: {
                    name: `azure-pg-admin-user`,
                  },
                },
              ],
              image:
                "registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:0.28.0",
              imagePullPolicy: "IfNotPresent",
              name: "create-db-user",
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
            },
          ],
          restartPolicy: "Never",
        },
      },
    },
  });
  return job;
};
