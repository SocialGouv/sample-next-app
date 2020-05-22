import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  subdomain: `beta-${process.env.CI_PROJECT_NAME as string}`,
} as Partial<GlobalEnvironment>;
