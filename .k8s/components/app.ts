import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { getGithubRegistryImagePath } from "@socialgouv/kosko-charts/utils/getGithubRegistryImagePath";

export default create("app", {
  env,
  config: {
    containerPort: 3000,
    withPostgres: true,
  },
  deployment: {
    image: getGithubRegistryImagePath({
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
