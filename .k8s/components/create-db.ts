import env from "@kosko/env";
import { ok } from "assert";

import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import { getPgServerHostname } from "@socialgouv/kosko-charts/utils/getPgServerHostname";

import { Job } from "kubernetes-models/batch/v1/Job";
import { Secret } from "kubernetes-models/v1/Secret";

import { create as createDb } from "@socialgouv/kosko-charts/components/azure-db";
import { create as createSecret } from "@socialgouv/kosko-charts/components/pg-secret";

const paramsDb = env.component("create-db");
const paramsSecret = env.component("pg-secret");

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");
ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

// use azure-pg-admin-user
const { createDbJob: job } = createDb(paramsDb);

// creates azure-pg-user
const { createSecret: secret } = createSecret(paramsSecret);

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(secret);
  defaultExport.push(job);
}
export default defaultExport;
