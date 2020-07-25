import env from "@kosko/env";
import { ok } from "assert";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");
ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

let params = env.component("azure-pg");

const manifests = create({
  env,
  config: {},
});

export default manifests;
