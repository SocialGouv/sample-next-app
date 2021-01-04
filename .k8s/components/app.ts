import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("app", {
  env,
  config: {
    containerPort: 3030,
    annotations: {
      "kapp.k14s.io/disable-default-ownership-label-rules": "",
      "kapp.k14s.io/disable-default-label-scoping-rules": "",
    },
  },
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
  },
});

export default manifests;
