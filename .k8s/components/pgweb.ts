import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { merge } from "@socialgouv/kosko-charts/utils/merge";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("pgweb");
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

deployment.spec!.template.spec!.containers[0].livenessProbe = {
  httpGet: {
    path: "/",
    port: "http",
  },
  initialDelaySeconds: 5,
  timeoutSeconds: 3,
};
deployment.spec!.template.spec!.containers[0].readinessProbe = {
  httpGet: {
    path: "/",
    port: "http",
  },
  initialDelaySeconds: 5,
  timeoutSeconds: 3,
};

if (process.env.ENABLE_AZURE_POSTGRES) {
  deployment.spec!.template.spec!.containers[0].envFrom = [
    {
      secretRef: {
        name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
      },
    },
  ];
}

//

export default [deployment, ingress, service];
