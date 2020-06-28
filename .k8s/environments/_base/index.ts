import gitlab from "@socialgouv/kosko-charts/environments/gitlab";
import { ok } from "assert";

const gitlabEnv =
  process.env.AUTO_DEVOPS_DEV_ENVIRONMENT_NAME ||
  process.env.AUTO_DEVOPS_PREPROD_ENVIRONMENT_NAME ||
  process.env.AUTO_DEVOPS_PROD_ENVIRONMENT_NAME;

ok(
  gitlabEnv,
  "Expect an AUTO_DEVOPS_*_ENVIRONMENT_NAME to be defined\n" +
    "HACK(douglasduteil): ensure that the sample-next-app is still deployable to our cluster v1\n" +
    "We should remove this section in the future ;)"
);

const ingress = gitlabEnv.endsWith("-dev")
  ? {
      ingress: {
        annotations: {
          "appgw.ingress.kubernetes.io/ssl-redirect": "true",
          "kubernetes.io/ingress.class": "azure/application-gateway",
        },
        secretName: "wildcard-crt",
      },
    }
  : {};
export default {
  ...gitlab(process.env),
  ...ingress,
};
