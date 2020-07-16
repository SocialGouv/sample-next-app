"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToEnvFrom = void 0;
const is_1 = require("@sindresorhus/is");
exports.addToEnvFrom = ({ deployment, data, containerIndex = 0, }) => {
    var _a;
    is_1.assert.object(deployment.spec);
    is_1.assert.object(deployment.spec.template.spec);
    const container = deployment.spec.template.spec.containers[containerIndex];
    container.envFrom = (_a = container.envFrom) !== null && _a !== void 0 ? _a : [];
    container.envFrom.push(...data);
};
//# sourceMappingURL=addToEnvFrom.js.map