import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";
import { addToEnvFrom } from "@socialgouv/kosko-charts/utils/addToEnvFrom";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";

const manifests = create("pgweb", {
  env,
  config: {
    image: "sosedoff/pgweb:latest",
    subdomain: `pgweb-${process.env.CI_PROJECT_NAME as string}`,
    livenessProbe: {
      httpGet: {
        path: "/",
        port: "http",
      },
      initialDelaySeconds: 5,
      timeoutSeconds: 3,
    },
    readinessProbe: {
      httpGet: {
        path: "/",
        port: "http",
      },
      initialDelaySeconds: 5,
      timeoutSeconds: 3,
    },
    containerPort: 8081,
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

export default manifests;

/*

if (process.env.ENABLE_AZURE_POSTGRES) {
  deployment.spec!.template.spec!.containers[0].envFrom = [
    {
      secretRef: {
        name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
      },
    },
  ];
}

*/
