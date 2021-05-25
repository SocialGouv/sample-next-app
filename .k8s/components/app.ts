import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";

const manifests = create("app", {
  env,
  config: {
    containerPort: 3030,
  },
  deployment: {
    image: getHarborImagePath({ name: "app" }),
    container: {
      resources: {
        requests: {
          cpu: "1m",
          memory: "64Mi",
        },
        limits: {
          cpu: "100m",
          memory: "256Mi",
        },
      },
    },
  },
});

export default manifests;
