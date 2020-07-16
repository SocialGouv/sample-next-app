"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataFromParams = void 0;
const matchLabels_1 = require("./matchLabels");
exports.metadataFromParams = (params) => {
    var _a;
    return ({
        annotations: params.annotations,
        labels: { ...matchLabels_1.matchLabelsFromParams(params), ...((_a = params.labels) !== null && _a !== void 0 ? _a : {}) },
        name: params.name,
        namespace: params.namespace.name,
    });
};
//# sourceMappingURL=metadata.js.map