import { Ingress } from "kubernetes-models/extensions/v1beta1/Ingress";

import { metadataFromParams } from "./metadata";
import { Params } from "./params";

export default (params: Params): Ingress => {
  const metadata = metadataFromParams(params);
  const host = `${params.subdomain}.${params.domain}`;

  return new Ingress({
    metadata: {
      ...metadata,
      annotations: {
        "certmanager.k8s.io/cluster-issuer": "letsencrypt-prod",
        "kubernetes.io/ingress.class": "nginx",
        "kubernetes.io/tls-acme": "true",
        ...params.ingress?.annotations,
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
                  servicePort: params.servicePort,
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
          secretName: params.ingress?.secretName,
        },
      ],
    },
  });
};
