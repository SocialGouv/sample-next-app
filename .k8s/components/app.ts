import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/app";

const manifests = create("app", {
  env,
  config: {
    image:
      "registry.gitlab.factory.social.gouv.fr/socialgouv/sample-next-app:002b0f68266e5243e733fe7c896b610f49757718",
    requests: {
      cpu: "1m",
      memory: "64Mi",
    },
    limits: {
      cpu: "50m",
      memory: "128Mi",
    },
    containerPort: 3030,
  },
});

export default manifests;
