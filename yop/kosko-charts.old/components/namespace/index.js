"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const NonEmptyString_1 = require("@socialgouv/kosko-charts/utils/NonEmptyString");
const onDecodeError_1 = require("@socialgouv/kosko-charts/utils/onDecodeError");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const D = tslib_1.__importStar(require("io-ts/lib/Decoder"));
const Namespace_1 = require("kubernetes-models/v1/Namespace");
const NamespaceComponentParams = pipeable_1.pipe(D.type({
    namespace: D.type({
        name: NonEmptyString_1.NonEmptyString,
    }),
}), D.intersect(D.partial({
    annotations: D.record(D.string),
    labels: D.record(D.string),
})));
const mapper = ({ namespace, labels, annotations, }) => ({
    namespace: new Namespace_1.Namespace({
        metadata: {
            annotations,
            labels: { app: namespace.name, ...labels },
            name: namespace.name,
        },
    }),
});
exports.create = (params) => pipeable_1.pipe(params, NamespaceComponentParams.decode, Either_1.fold(onDecodeError_1.onDecodeError, () => mapper(params)));
//# sourceMappingURL=index.js.map