import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";

const params = env.component("app");
const { deployment, ingress, service } = create(params);

//
ok(process.env.CI_ENVIRONMENT_NAME);
if (
  process.env.CI_ENVIRONMENT_NAME.endsWith("-dev") ||
  process.env.CI_ENVIRONMENT_NAME.endsWith("prod")
) {
  // HACK(douglasduteil): our cluster v1 is not supporting the `startupProbe`
  // Our cluster v1 is stuck in k8s v1.14 :(
  delete deployment.spec!.template.spec!.containers[0].startupProbe;
}

//

const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`,
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production",
    FRONTEND_HOST: "${HOST}",
    GRAPHQL_ENDPOINT: "http://hasura/v1/graphql",
    ACCOUNT_MAIL_SENDER: "contact@fabrique.social.gouv.fr",
    FRONTEND_PORT: "${PORT}",
    PRODUCTION: "false",
  },
});

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: { name: `${params.name}-env` },
  },
];

//

export default [deployment, ingress, service, envConfigMap];
