import env from "@kosko/env";
import { ok } from "assert";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";
import { addWaitForPostgres } from "@socialgouv/kosko-charts/utils/addWaitForPostgres";

const manifests = create("pgweb", {
  env,
  config: {
    image: "sosedoff/pgweb:latest",
    containerPort: 8081,
    subDomainPrefix: "pgweb-",
  },
  deployment: {
    container: {
      livenessProbe: {
        httpGet: {
          path: "/",
          port: "http",
        },
        initialDelaySeconds: 5,
        timeoutSeconds: 3,
      },
      readinessProbe: {
        httpGet: {
          path: "/",
          port: "http",
        },
        initialDelaySeconds: 5,
        timeoutSeconds: 3,
      },
    },
  },
});

// DEV: add secret to access DB
const deployment = manifests.find(
  (manifest): manifest is Deployment => manifest.kind === "Deployment"
);
ok(deployment);
addPostgresUserSecret(deployment);
addWaitForPostgres(deployment);
export default manifests;
