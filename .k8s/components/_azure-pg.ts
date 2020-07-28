import env from "@kosko/env";
import { ok } from "assert";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

let params = env.component("azure-pg");

const manifests = create({
  env,
  config: {},
});

export default manifests;
