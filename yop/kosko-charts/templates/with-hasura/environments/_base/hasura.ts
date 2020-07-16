import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { ok } from "assert";

ok(process.env.CI_REGISTRY_IMAGE);
ok(process.env.CI_COMMIT_SHA);

const name = "hasura";
const env: AppComponentEnvironment = {
  containerPort: 8080,

  image: {
    name: `${process.env.CI_REGISTRY_IMAGE}/${name}`,
    tag: process.env.CI_COMMIT_TAG
      ? process.env.CI_COMMIT_TAG.slice(1)
      : process.env.CI_COMMIT_SHA,
  },

  ingress: {
    secretName: process.env.PRODUCTION ? `${name}-crt` : "wildcard-crt",
  },

  labels: {
    component: name,
  },
  name,

  servicePort: 80,
};

export default env;
