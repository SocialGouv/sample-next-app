import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("app", {
  env,
  config: {},
  deployment: {
    container: {
      resources: {
        requests: {
          cpu: "1m",
          memory: "64Mi",
        },
        limits: {
          cpu: "50m",
          memory: "128Mi",
        },
      },
    },
    containerPort: 3030,
  },
});

export default manifests;
