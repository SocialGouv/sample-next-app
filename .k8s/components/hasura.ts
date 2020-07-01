import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { addToEnvFrom } from "@socialgouv/kosko-charts/utils/addToEnvFrom";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";
import { loadYaml } from "../getEnvironmentComponent";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const params = env.component("hasura");
const { deployment, ingress, service } = create(params);

//

const secret = new SealedSecret({
  ...loadYaml(env, "hasura-env.sealed-secret.yaml"),
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
});

//

const configMap = new ConfigMap({
  ...loadYaml(env, "hasura-env.configmap.yaml"),
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env`,
  },
});

//

const secretSource = new EnvFromSource({
  secretRef: {
    name: `hasura-env`,
  },
});

const configMapSource = new EnvFromSource({
  configMapRef: {
    name: `hasura-env`,
  },
});

addToEnvFrom({
  deployment,
  data: [secretSource, configMapSource],
});

if (process.env.ENABLE_AZURE_POSTGRES) {
  const azureSecretSource = new EnvFromSource({
    secretRef: {
      name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  });
  addToEnvFrom({
    deployment,
    data: [azureSecretSource],
  });
}

//

export default [deployment, ingress, service, configMap, secret];
