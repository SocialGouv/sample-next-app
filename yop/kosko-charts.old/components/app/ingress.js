"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ingress_1 = require("kubernetes-models/extensions/v1beta1/Ingress");
const metadata_1 = require("./metadata");
exports.default = (params) => {
    var _a, _b;
    const metadata = metadata_1.metadataFromParams(params);
    const host = `${params.subdomain}.${params.domain}`;
    return new Ingress_1.Ingress({
        metadata: {
            ...metadata,
            annotations: {
                "certmanager.k8s.io/cluster-issuer": "letsencrypt-prod",
                "kubernetes.io/ingress.class": "nginx",
                "kubernetes.io/tls-acme": "true",
                ...(_a = params.ingress) === null || _a === void 0 ? void 0 : _a.annotations,
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
                    secretName: (_b = params.ingress) === null || _b === void 0 ? void 0 : _b.secretName,
                },
            ],
        },
    });
};
//# sourceMappingURL=ingress.js.map