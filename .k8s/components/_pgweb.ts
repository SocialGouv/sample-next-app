import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/pgweb";

const manifests = create("pgweb", {
  env,
  config: {
    annotations: {
      "kapp.k14s.io/disable-default-ownership-label-rules": "",
      "kapp.k14s.io/disable-default-label-scoping-rules": "",
    },
  },
});

export default manifests;
