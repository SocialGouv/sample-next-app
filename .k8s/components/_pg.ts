import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

const manifests = create({
  env,
});

export default env.env === "dev" ? manifests : [];
