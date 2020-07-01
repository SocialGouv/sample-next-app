import { ok } from "assert";
import { CreateDbJobParameters } from "@socialgouv/kosko-charts/components/azure-db/params";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const sha = process.env.CI_COMMIT_SHORT_SHA;

export default {
  name: `create-db-job-${sha}`,
  database: `autodevops_${sha}`,
  user: `user_${sha}`,
  password: `password_${sha}`,
} as CreateDbJobParameters;
