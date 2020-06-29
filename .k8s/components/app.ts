import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { merge } from "@socialgouv/kosko-charts/utils/merge";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";
import {
  koskoMigrateLoader,
  getEnvironmentComponent,
} from "../getEnvironmentComponent";

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

const [envSecret] = getEnvironmentComponent(env, "app-env.sealed-secret.yaml", {
  loader: koskoMigrateLoader,
});

const appSecret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `app-env`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
});
const secret = merge(envSecret, appSecret);

//

const [envConfigMap] = getEnvironmentComponent(env, "app-env.configmap.yaml", {
  loader: koskoMigrateLoader,
});
const appConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `app-env`,
  },
  data: {
    FRONTEND_HOST: ingress.spec!.rules![0].host!,
  },
});
const configmap = merge(envConfigMap, appConfigMap);

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

export default [secret, configmap, deployment, ingress, service];
