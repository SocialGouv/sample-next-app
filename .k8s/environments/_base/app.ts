import { AppComponentEnvironment } from "@socialgouv/kosko-charts/types";
export default {
  name: "www",
  image: {
    name: process.env.CI_REGISTRY_IMAGE,
    tag: process.env.CI_COMMIT_SHA,
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
