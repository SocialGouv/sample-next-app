import {
  GlobalEnvironment,
  NamedComponentEnvironment,
} from "@socialgouv/kosko-charts/types";
import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

import { matchLabelsFromParams } from "./matchLabels";

export const metadataFromParams = (
  params: GlobalEnvironment & NamedComponentEnvironment
): IIoK8sApimachineryPkgApisMetaV1ObjectMeta & NamedComponentEnvironment => ({
  annotations: params.annotations,
  labels: { ...matchLabelsFromParams(params), ...(params.labels ?? {}) },
  name: params.name,
  namespace: params.namespace.name,
});
