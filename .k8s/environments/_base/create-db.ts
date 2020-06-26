import { CreateDbEnvironment } from "index";

export default {
  jobName: `job-${process.env.CI_COMMIT_SHORT_SHA}`,
  dbName: "production_db",
  dbUser: "production_user",
  dbPassword: "production_password",
} as CreateDbEnvironment;
