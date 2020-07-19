import env from "@kosko/env";
import { ok } from "assert";

import { create as createDb } from "@socialgouv/kosko-charts/components/azure-db";
import { create as createSecret } from "@socialgouv/kosko-charts/components/pg-secret";

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");
ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const defaultExport = [];

console.log("CI_COMMIT_SHORT_SHA", process.env.CI_COMMIT_SHORT_SHA);
console.log("env.component('create-db')", env.component("create-db"));
let params = env.component("create-db");
params.database = "yopyop";
params.password = "yopyop";
params.user = "yopyop";

const { createDbJob: job } = createDb(params);

// creates azure-pg-user secret
params = env.component("pg-secret");
params.database = "yopyop";
params.password = "yopyop";
params.user = "yopyop";
params.host = "yopyop";

// const { createSecret: secret } = createSecret(env.component("pg-secret"));
const { createSecret: secret } = createSecret(params);

export default [job, secret];
