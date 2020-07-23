import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { ok } from "assert";

import globalDevEnv from "../dev";

ok(process.env.CI_PROJECT_NAME);

export default {
  ...globalDevEnv,
  labels: {
    application: `preprod-${process.env.CI_PROJECT_NAME}`,
  },
  namespace: { name: `preprod-${process.env.CI_PROJECT_NAME}` },
  subdomain: `preprod-${process.env.CI_PROJECT_NAME}`,
} as Partial<GlobalEnvironment>;
