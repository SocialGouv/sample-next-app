"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const onDecodeError_1 = require("@socialgouv/kosko-charts/utils/onDecodeError");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const deployment_1 = tslib_1.__importDefault(require("./deployment"));
const ingress_1 = tslib_1.__importDefault(require("./ingress"));
const params_1 = require("./params");
const service_1 = tslib_1.__importDefault(require("./service"));
const mapper = (params) => ({
    deployment: deployment_1.default(params),
    ingress: ingress_1.default(params),
    service: service_1.default(params),
});
exports.create = (params) => pipeable_1.pipe(params, params_1.AppComponentParams.decode, Either_1.fold(onDecodeError_1.onDecodeError, () => mapper(params)));
//# sourceMappingURL=index.js.map