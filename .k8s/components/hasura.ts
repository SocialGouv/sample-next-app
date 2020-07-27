import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";

// todo: extract to @socialgouv/kosko-charts/components/hasura
const manifests = create("hasura", {
  env,
  config: {
    //ingress: false,
    subdomain: `hasura-${process.env.CI_PROJECT_NAME as string}`,
    requests: {
      cpu: "100m",
      memory: "64Mi",
    },
    limits: {
      cpu: "500m",
      memory: "256Mi",
    },
    livenessProbe: {
      httpGet: {
        path: "/healthz",
        port: "http",
      },
      initialDelaySeconds: 60,
      periodSeconds: 20,
    },
    readinessProbe: {
      httpGet: {
        path: "/healthz",
        port: "http",
      },
      initialDelaySeconds: 60,
      periodSeconds: 20,
    },
    containerPort: 80,
  },
});

// DEV: add secret to access DB
//@ts-expect-error
const deployment = manifests.find((manifest) => manifest.kind === "Deployment");
addPostgresUserSecret(deployment);

//

export default manifests;
