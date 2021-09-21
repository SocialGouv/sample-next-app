import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";

export default create("app", {
  env,
  config: {
    containerPort: 3000,
    withPostgres: true,
  },
  deployment: {
    image: getHarborImagePath({
      project: "sample-next-app",
      name: "app",
    }),
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
