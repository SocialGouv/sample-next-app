import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";

const params = env.component("app");
const { deployment, ingress, service } = create(params);

//

const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production"
  }
})

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: {name: `${params.name}-env`}
  }
];

//

export default [deployment, ingress, service, envConfigMap];
