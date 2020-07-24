import { Ingress } from "kubernetes-models/extensions/v1beta1/Ingress";

import { ok } from "assert";
import { Params } from "./params";
import { Config } from "../../Config";
import { merge } from "@socialgouv/kosko-charts/utils/merge";

export default (name: string, config: Config, params: Params): Ingress => {
  const metadata = {
    ...config.app.metadata,
    name,
    namespace: config.namespace.metadata.name,
  };
  const host = `${config.subdomain}.${config.domain}`;
  ok(params.service.ports, "Missing params.service.ports");
  return new Ingress(
    merge(
      {
        metadata: {
          ...metadata,
          annotations: {
            "certmanager.k8s.io/cluster-issuer": "letsencrypt-prod",
            "kubernetes.io/ingress.class": "nginx",
            "kubernetes.io/tls-acme": "true",
          },
        },
        spec: {
          rules: [
            {
              host,
              http: {
                paths: [
                  {
                    backend: {
                      serviceName: metadata.name,
                      servicePort: params.service.ports[0].port,
                    },
                    path: "/",
                  },
                ],
              },
            },
          ],
          tls: [
            {
              hosts: [host],
              secretName: "wild-cert",
            },
          ],
        },
      },
      params.ingress
    )
  );
};
