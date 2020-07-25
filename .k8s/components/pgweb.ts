import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("pgweb", {
  env,
  config: {
    image: "pouet:42",
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
