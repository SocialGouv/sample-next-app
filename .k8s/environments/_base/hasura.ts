import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  name: "hasura",
  image: {
    name: process.env.CI_REGISTRY_IMAGE + "/hasura",
    tag: process.env.CI_COMMIT_TAG
      ? process.env.CI_COMMIT_TAG.slice(1)
      : process.env.CI_COMMIT_SHA,
  },
  // subdomain: `hasura-${process.env.CI_ENVIRONMENT_SLUG}`,
  ingress: {
    secretName: process.env.PRODUCTION ? "hasura-crt" : "wildcard-crt",
  },
  labels: {
    component: "hasura",
  },
  requests: {
    cpu: "100m",
    memory: "64Mi",
  },
  limits: {
    cpu: "500m",
    memory: "256Mi",
  },
  containerPort: 80,
  servicePort: 80,
} as Readonly<AppComponentEnvironment>;
