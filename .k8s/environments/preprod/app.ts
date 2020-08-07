import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  subdomain: `preprod-${process.env.CI_PROJECT_NAME as string}`,
} as Partial<GlobalEnvironment>;
