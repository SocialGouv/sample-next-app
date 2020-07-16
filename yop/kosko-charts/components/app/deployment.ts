import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { matchLabelsFromParams } from "./matchLabels";
import { metadataFromParams } from "./metadata";
import { Params } from "./params";

export default (params: Params): Deployment => {
  const metadata = metadataFromParams(params);
  return new Deployment({
    metadata,
    spec: {
      replicas: 1,
      selector: {
        matchLabels: matchLabelsFromParams(params),
      },
      template: {
        metadata: {
          annotations: metadata.annotations,
          labels: metadata.labels,
        },
        spec: {
          containers: [
            {
              image: `${params.image.name}:${params.image.tag}`,
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
              name: metadata.name,
              ports: [
                {
                  containerPort: params.containerPort,
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
                  ...(params.limits ?? {}),
                },
                requests: {
                  cpu: "5m",
                  memory: "16Mi",
                  ...(params.requests ?? {}),
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
          ],
        },
      },
    },
  });
};
