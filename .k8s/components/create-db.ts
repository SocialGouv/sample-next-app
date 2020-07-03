import env from "@kosko/env";
import { ok } from "assert";

import { create as createDb } from "@socialgouv/kosko-charts/components/azure-db";
import { create as createSecret } from "@socialgouv/kosko-charts/components/pg-secret";

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");
ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const defaultExport = [];

const { createDbJob: job } = createDb(env.component("create-db"));

// creates azure-pg-user secret
const { createSecret: secret } = createSecret(env.component("pg-secret"));

export default [job, secret];
