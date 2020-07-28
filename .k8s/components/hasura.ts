import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/hasura";

// todo: extract to @socialgouv/kosko-charts/components/hasura
const manifests = create({
  env,
  config: {},
});

export default manifests;
