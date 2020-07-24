import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("hasura", {
  env,
  config: {
    subdomain: `hasura-${process.env.CI_PROJECT_NAME as string}`,
    requests: {
      cpu: "100m",
      memory: "64Mi",
    },
    limits: {
      cpu: "500m",
      memory: "256Mi",
    },
    containerPort: 80,
  },
});

// if (process.env.ENABLE_AZURE_POSTGRES) {
//   const azureSecretSource = new EnvFromSource({
//     secretRef: {
//       name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
//     },
//   });
//   addToEnvFrom({
//     deployment,
//     data: [azureSecretSource],
//   });
// }

//

export default manifests;
