import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addPostgresUserSecret } from "@socialgouv/kosko-charts/utils/addPostgresUserSecret";

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
    containerPort: 80,
  },
});

// DEV: add secret to access DB
//@ts-expect-error
const deployment = manifests.find((manifest) => manifest.kind === "Deployment");
addPostgresUserSecret(deployment);

//

export default manifests;
