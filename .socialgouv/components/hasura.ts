import env from "@kosko/env";

import { create } from "@socialgouv/kosko-charts/components/hasura";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";

export default create("hasura", {
  env,
  deployment: {
    image: getHarborImagePath({
      project: "sample-next-app",
      name: "hasura",
    }),
  },
});
