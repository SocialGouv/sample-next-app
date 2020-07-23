import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import { matchLabelsFromParams } from "./matchLabels";
import { metadataFromParams } from "./metadata";
import { Params } from "./params";
import { Config } from "src/Config";

export default (name: string, config: Config): Deployment => {
  const metadata = {
    ...config.app.metadata,
    name,
    namespace: config.namespace.metadata.name,
  };
  return new Deployment({
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
            {
              // image: `${config.image.name}:${config.image.tag}`,
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
              name: "lol", //metadata.name,
              ports: [
                {
                  containerPort: 545, //config.containerPort,
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
                  // ...(config.limits ?? {}),
                },
                requests: {
                  cpu: "5m",
                  memory: "16Mi",
                  // ...(config.requests ?? {}),
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
