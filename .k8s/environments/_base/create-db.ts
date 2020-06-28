import { CreateDbEnvironment } from "index";

export default {
  name: `create-db-${process.env.CI_COMMIT_SHORT_SHA}`,
  dbName: "production_db",
  dbUser: "production_user",
  dbPassword: "production_password",
} as CreateDbEnvironment;
