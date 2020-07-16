"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const onDecodeError_1 = require("@socialgouv/kosko-charts/utils/onDecodeError");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const create_db_job_1 = require("./create-db.job");
const params_1 = require("./params");
const mapper = (params) => ({
    createDbJob: create_db_job_1.createDbJob(params),
});
exports.create = (params) => pipeable_1.pipe(params, params_1.CreateDbComponentParams.decode, Either_1.fold(onDecodeError_1.onDecodeError, () => mapper(params)));
//# sourceMappingURL=index.js.map