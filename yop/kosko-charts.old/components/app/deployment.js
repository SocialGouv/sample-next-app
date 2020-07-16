"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Deployment_1 = require("kubernetes-models/apps/v1/Deployment");
const matchLabels_1 = require("./matchLabels");
const metadata_1 = require("./metadata");
exports.default = (params) => {
    var _a, _b;
    const metadata = metadata_1.metadataFromParams(params);
    return new Deployment_1.Deployment({
        metadata,
        spec: {
            replicas: 1,
            selector: {
                matchLabels: matchLabels_1.matchLabelsFromParams(params),
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
                                    ...((_a = params.limits) !== null && _a !== void 0 ? _a : {}),
                                },
                                requests: {
                                    cpu: "5m",
                                    memory: "16Mi",
                                    ...((_b = params.requests) !== null && _b !== void 0 ? _b : {}),
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
//# sourceMappingURL=deployment.js.map