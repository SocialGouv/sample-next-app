import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/hasura";
import { getGithubRegistryImagePath } from "@socialgouv/kosko-charts/utils/getGithubRegistryImagePath";

export default create("hasura", {
  env,
  deployment: {
    image: getGithubRegistryImagePath({
      project: "sample-next-app",
      name: "hasura",
    }),
  },
});
