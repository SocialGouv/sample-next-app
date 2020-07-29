import env from "@kosko/env";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

import { create } from "@socialgouv/kosko-charts/components/hasura";
import { loadYaml } from "@socialgouv/kosko-charts/utils/getEnvironmentComponent";
import { updateMetadata } from "@socialgouv/kosko-charts/utils/updateMetadata";
import gitlab from "@socialgouv/kosko-charts/environments/gitlab";

const manifests = create({
  env,
});

if (env.env?.includes("prod") || env.env?.includes("preprod")) {
  /* SEALED-SECRET */
  // try to import environment sealed-secret
  const secret = loadYaml<SealedSecret>(env, `pg-user.sealed-secret.yaml`);
  if (secret) {
    const envParams = gitlab(process.env);
    // add gitlab annotations
    updateMetadata(secret, {
      annotations: envParams.annotations || {},
      labels: envParams.labels || {},
      namespace: envParams.namespace,
    });
    manifests.unshift(secret);
  }
}

export default manifests;
