import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addToEnvFrom } from "@socialgouv/kosko-charts/utils/addToEnvFrom";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";

const manifests = create("hasura", {
  env,
  config: {
    //ingress: false,
    image:
      "registry.gitlab.factory.social.gouv.fr/socialgouv/sample-next-app/hasura:002b0f68266e5243e733fe7c896b610f49757718",
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
if (deployment) {
  const azureSecretSource = new EnvFromSource({
    secretRef: {
      name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  });
  addToEnvFrom({
    //@ts-expect-error
    deployment,
    data: [azureSecretSource],
  });
}

//

export default manifests;
