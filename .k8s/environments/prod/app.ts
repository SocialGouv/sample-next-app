import { AppConfig } from "@socialgouv/kosko-charts/components/app";

export default {
  subdomain: `beta-${process.env.CI_PROJECT_NAME}`,
} as Partial<AppConfig>;
