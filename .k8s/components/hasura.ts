import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";

const params = env.component("hasura");
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
/*
  envFrom:
    - configMapRef:
        name: hasura-env
    - secretRef:
        name: hasura-env
*/
const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`,
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production",
    HASURA_GRAPHQL_ENABLE_CONSOLE: "false",
    HASURA_GRAPHQL_SERVER_PORT: "80",
    HASURA_GRAPHQL_ENABLED_LOG_TYPES:
      "startup, http-log, webhook-log, websocket-log, query-log",
    HASURA_GRAPHQL_NO_OF_RETRIES: "5",
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous",
    ACCOUNT_EMAIL_WEBHOOK_URL: "http://app:3000/api/webhooks/account",
  },
});

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: { name: `${params.name}-env` },
  },
  {
    secretRef: { name: `${params.name}-env` },
  },
  //   {
  //     secretRef: { name: `azure-pg-user` },
  //   },
];

//

export default [deployment, ingress, service, envConfigMap];
