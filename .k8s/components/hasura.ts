import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/hasura";

// todo: extract to @socialgouv/kosko-charts/components/hasura
const manifests = create("hasura", {
  env,
});

export default manifests;
