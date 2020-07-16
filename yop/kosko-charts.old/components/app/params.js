"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponentParams = void 0;
const tslib_1 = require("tslib");
const Integer_1 = require("@socialgouv/kosko-charts/utils/Integer");
const NonEmptyString_1 = require("@socialgouv/kosko-charts/utils/NonEmptyString");
const pipeable_1 = require("fp-ts/lib/pipeable");
const D = tslib_1.__importStar(require("io-ts/lib/Decoder"));
exports.AppComponentParams = pipeable_1.pipe(D.type({
    containerPort: Integer_1.Integer,
    image: D.type({
        name: NonEmptyString_1.NonEmptyString,
        tag: NonEmptyString_1.NonEmptyString,
    }),
    name: D.string,
    namespace: D.type({
        name: NonEmptyString_1.NonEmptyString,
    }),
    servicePort: Integer_1.Integer,
}), D.intersect(D.partial({
    ingress: D.partial({
        secretName: D.string,
    }),
    labels: D.record(D.string),
    limits: D.type({ cpu: D.string, memory: D.string }),
    requests: D.type({ cpu: D.string, memory: D.string }),
})));
//# sourceMappingURL=params.js.map