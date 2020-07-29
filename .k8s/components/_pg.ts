import env from "@kosko/env";
import { ok } from "assert";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

let params = env.component("pg");

const manifests = create({
  env,
});

export default manifests;
