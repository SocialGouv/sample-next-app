import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  name: "www",
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
    component: "unknow",
  },
  requests: {
    cpu: "100m",
    memory: "128Mi",
  },
  limits: {
    cpu: "1000m",
    memory: "1Gi",
  },
  containerPort: 8501,
  servicePort: 80,
} as Readonly<AppComponentEnvironment>;
