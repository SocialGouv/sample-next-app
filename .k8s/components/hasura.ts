import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("app", env);

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
