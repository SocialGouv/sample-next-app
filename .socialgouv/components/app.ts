import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import environments from "@socialgouv/kosko-charts/environments";

const ciEnv = environments(process.env);

export default create("app", {
  env,
  config: {
    containerPort: 3000,
    withPostgres: true,
  },
  deployment: {
    image: `ghcr.io/socialgouv/sample-next-app/app:${ciEnv.tag || ciEnv.sha}`,
    container: {
      resources: {
        requests: {
          cpu: "100m",
          memory: "128Mi",
        },
        limits: {
          cpu: "500m",
          memory: "256Mi",
        },
      },
      startupProbe: {
        initialDelaySeconds: 15,
      },
    },
  },
});
