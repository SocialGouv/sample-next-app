"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostresSecretParameters = void 0;
const tslib_1 = require("tslib");
const NonEmptyString_1 = require("@socialgouv/kosko-charts/utils/NonEmptyString");
const pipeable_1 = require("fp-ts/lib/pipeable");
const D = tslib_1.__importStar(require("io-ts/lib/Decoder"));
exports.PostresSecretParameters = pipeable_1.pipe(D.type({
    database: NonEmptyString_1.NonEmptyString,
    host: NonEmptyString_1.NonEmptyString,
    password: NonEmptyString_1.NonEmptyString,
    user: NonEmptyString_1.NonEmptyString,
}), D.intersect(D.partial({
    sslmode: NonEmptyString_1.NonEmptyString,
})));
//# sourceMappingURL=params.js.map