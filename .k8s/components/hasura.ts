import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/hasura";
import environments from '@socialgouv/kosko-charts/environments';

const ciEnv = environments(process.env);

export default create("hasura", {
  env,
  deployment: {
    image: `ghcr.io/socialgouv/sample-next-app/hasura:sha-${ciEnv.tag || ciEnv.sha}`,
  },
});
