import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  ingress: {
    annotations: {
      "kubernetes.io/tls-acme": null,
      "certmanager.k8s.io/cluster-issuer": null,
    },
    secretName: "wildcard-crt",
  },
} as Partial<GlobalEnvironment>;
