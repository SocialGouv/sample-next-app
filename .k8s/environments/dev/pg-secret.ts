import { ok } from "assert";
import { PostresSecretParameters } from "@socialgouv/kosko-charts/components/pg-secret/params";
import { getPgServerHostname } from "@socialgouv/kosko-charts/utils/getPgServerHostname";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");
ok(process.env.CI_PROJECT_NAME, "Expect CI_PROJECT_NAME to be defined");

const sha = process.env.CI_COMMIT_SHORT_SHA;
const projectName = process.env.CI_PROJECT_NAME;

export default {
  name: `azure-pg-user-${sha}`,
  database: `autodevops_${sha}`,
  user: `user_${sha}`,
  password: `password_${sha}`,
  host: getPgServerHostname(projectName, "dev"),
} as PostresSecretParameters;
