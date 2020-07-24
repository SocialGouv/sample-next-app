import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { matchLabelsFromParams } from "./matchLabels";
import { metadataFromParams } from "./metadata";
import { Params } from "./params";
import { Config } from "../../Config";
import { merge } from "@socialgouv/kosko-charts/utils/merge";

export default (name: string, config: Config, params: Params): Deployment => {
  const metadata = {
    ...config.app.metadata,
    name,
    namespace: config.namespace.metadata.name,
  };
  return new Deployment(
    merge(params.deployment, {
      metadata,
      spec: {
        replicas: 1,
        selector: {
          matchLabels: { app: name },
        },
        template: {
          metadata: {
            annotations: metadata.annotations,
            labels: { ...metadata.labels, app: name },
          },
          spec: {
            containers: [
              merge(
                {
                  livenessProbe: {
                    // 6 x 5s + 30s = 30-1m
                    // Kill the pod if not alive after 1 minute
                    failureThreshold: 6,
                    httpGet: {
                      path: "/healthz",
                      port: "http",
                    },
                    initialDelaySeconds: 30,
                    periodSeconds: 5,
                    timeoutSeconds: 5,
                  },
                  name,
                  ports: [
                    {
                      containerPort: 8080,
                      name: "http",
                    },
                  ],
                  readinessProbe: {
                    // 15 x 1s = 0-15s
                    // Mark pod as unhealthy after 15s
                    failureThreshold: 15,
                    httpGet: {
                      path: "/healthz",
                      port: "http",
                    },
                    initialDelaySeconds: 0,
                    periodSeconds: 5,
                    successThreshold: 1,
                    timeoutSeconds: 1,
                  },
                  resources: {
                    limits: {
                      cpu: "500m",
                      memory: "128Mi",
                    },
                    requests: {
                      cpu: "5m",
                      memory: "16Mi",
                    },
                  },
                  startupProbe: {
                    // 12 x 5s = 0-1min
                    // Takes up to 1 minute to start up before it fails
                    failureThreshold: 12,
                    httpGet: {
                      path: "/healthz",
                      port: "http",
                    },
                    periodSeconds: 5,
                  },
                },
                params.deployment.spec.template.spec.containers[0]
              ),
            ],
          },
        },
      },
    })
  );
};
