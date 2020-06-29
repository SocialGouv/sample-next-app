import { ok } from "assert";
import { CreateDbEnvironment } from "index";

ok(process.env.CI_COMMIT_SHORT_SHA);

const sha = process.env.CI_COMMIT_SHORT_SHA;

export default {
  name: "create-db-job",
  database: `autodevops_${sha}`,
  user: `user_${sha}`,
  password: `password_${sha}`,
} as Partial<CreateDbEnvironment>;
