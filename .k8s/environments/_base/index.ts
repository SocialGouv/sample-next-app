import gitlab from "@socialgouv/kosko-charts/environments/gitlab";
import { merge } from "@socialgouv/kosko-charts/utils/merge";
import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default merge(gitlab(process.env), {
  ingress: {
    annotations: {
      "appgw.ingress.kubernetes.io/ssl-redirect": undefined,
      "certmanager.k8s.io/cluster-issuer": "letsencrypt-prod",
      "kubernetes.io/ingress.class": "nginx",
      "kubernetes.io/tls-acme": "true",
    }
  }
} as Partial<GlobalEnvironment>);
