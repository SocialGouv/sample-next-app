import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  subdomain: `alpha-${process.env.CI_PROJECT_NAME as string}`,
} as Partial<GlobalEnvironment>;
