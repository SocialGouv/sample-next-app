"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProdDatabaseParameters = exports.getDevDatabaseParameters = exports.CreateDbComponentParams = void 0;
const tslib_1 = require("tslib");
const NonEmptyString_1 = require("@socialgouv/kosko-charts/utils/NonEmptyString");
const pipeable_1 = require("fp-ts/lib/pipeable");
const D = tslib_1.__importStar(require("io-ts/lib/Decoder"));
exports.CreateDbComponentParams = pipeable_1.pipe(D.type({
    database: NonEmptyString_1.NonEmptyString,
    password: NonEmptyString_1.NonEmptyString,
    user: NonEmptyString_1.NonEmptyString,
}), D.intersect(D.partial({
    extensions: NonEmptyString_1.NonEmptyString,
})));
// default dev values
function getDevDatabaseParameters({ suffix, }) {
    return {
        database: `autodevops_${suffix}`,
        password: `password_${suffix}`,
        user: `user_${suffix}`,
    };
}
exports.getDevDatabaseParameters = getDevDatabaseParameters;
function getProdDatabaseParameters() {
    return {
        database: "production_db",
        password: "production_password",
        user: "production_user",
    };
}
exports.getProdDatabaseParameters = getProdDatabaseParameters;
//# sourceMappingURL=params.js.map