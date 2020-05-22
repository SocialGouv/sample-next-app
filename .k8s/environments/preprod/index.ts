import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  namespace: {name: `preprod-${process.env.CI_PROJECT_NAME}`},
  subdomain: `preprod-${process.env.CI_PROJECT_NAME}`,
  labels: {
    application: `preprod-${process.env.CI_PROJECT_NAME}`,
  },
  ingress: {
    annotations: {
      "kubernetes.io/tls-acme": undefined,
      "certmanager.k8s.io/cluster-issuer": undefined,
    },
    secretName: "wildcard-crt",
  },
} as Partial<GlobalEnvironment>;
