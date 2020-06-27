import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  name: "app",
  image: {
    name: process.env.CI_REGISTRY_IMAGE,
    tag: process.env.CI_COMMIT_TAG
      ? process.env.CI_COMMIT_TAG.slice(1)
      : process.env.CI_COMMIT_SHA,
  },
  ingress: {
    secretName: process.env.PRODUCTION ? "www-crt" : "wildcard-crt",
  },
  labels: {
    component: "next",
  },
  requests: {
    cpu: "1m",
    memory: "64Mi",
  },
  limits: {
    cpu: "50m",
    memory: "128Mi",
  },
  containerPort: 3030,
  servicePort: 3030,
} as Readonly<AppComponentEnvironment>;
