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
  containerPort: 8080,
  servicePort: 8080,
} as Readonly<AppComponentEnvironment>;
