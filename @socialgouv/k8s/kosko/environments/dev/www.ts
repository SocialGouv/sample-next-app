import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  ingress: {
    annotations: {
      "certmanager.k8s.io/cluster-issuer": undefined,
      "kubernetes.io/tls-acme": undefined,
    },
  },
} as Partial<GlobalEnvironment>;
