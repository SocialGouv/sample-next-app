import { ok } from "assert";
import { CreateDbEnvironment } from "index";

ok(process.env.CI_COMMIT_SHORT_SHA);

const sha = process.env.CI_COMMIT_SHORT_SHA;

export default {
  dbName: `autodevops_${sha}`,
  dbUser: `user_${sha}`,
  dbPassword: `password_${sha}`,
} as Partial<CreateDbEnvironment>;
