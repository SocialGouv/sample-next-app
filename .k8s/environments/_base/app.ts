import { AppComponentEnvironment } from "@socialgouv/kosko-charts/types";
export default {
  name: "www",
  image: {
    name: "registry.gitlab.factory.social.gouv.fr/socialgouv/sample-next-app",
    tag: "1118b7914282ed114c77a1338d83330e90185777",
  },
  containerPort: 8080,
  servicePort: 8080,
} as Readonly<AppComponentEnvironment>;
