"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("kubernetes-models/v1/Service");
const matchLabels_1 = require("./matchLabels");
const metadata_1 = require("./metadata");
exports.default = (params) => {
    const metadata = metadata_1.metadataFromParams(params);
    return new Service_1.Service({
        metadata,
        spec: {
            ports: [
                {
                    port: params.servicePort,
                    targetPort: params.containerPort,
                },
            ],
            selector: matchLabels_1.matchLabelsFromParams(params),
            type: "ClusterIP",
        },
    });
};
//# sourceMappingURL=service.js.map