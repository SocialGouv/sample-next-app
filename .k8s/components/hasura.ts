import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { merge } from "@socialgouv/kosko-charts/utils/merge";
import {
  koskoMigrateLoader,
  getEnvironmentComponent,
} from "../getEnvironmentComponent";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("hasura");
const { deployment, ingress, service } = create(params);

// todo ?
const PG_HOST = "samplenextappdevserver.postgres.database.azure.com";

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

const [envSecret] = getEnvironmentComponent(
  env,
  "hasura-env.sealed-secret.yaml",
  {
    loader: koskoMigrateLoader,
  }
);

const hasuraSecret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
});
const secret = merge(envSecret, hasuraSecret);

//

const [envConfigMap] = getEnvironmentComponent(
  env,
  "hasura-env.configmap.yaml",
  {
    loader: koskoMigrateLoader,
  }
);
const hasuraConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env`,
  },
});
const configmap = merge(envConfigMap, hasuraConfigMap);

//

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: {
      name: `${params.name}-env`,
    },
  },
  {
    secretRef: {
      name: `${params.name}-env`,
    },
  },
];

if (process.env.ENABLE_AZURE_POSTGRES) {
  deployment.spec!.template.spec!.containers[0].envFrom.push({
    secretRef: {
      name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  });
}

//

export default [deployment, ingress, service, configmap, secret];
