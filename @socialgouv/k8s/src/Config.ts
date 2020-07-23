import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

export class Config {
  constructor(env = process.env) {
    this.namespace = {
      metadata: {},
    };
  }
  namespace: { metadata: IIoK8sApimachineryPkgApisMetaV1ObjectMeta };
}
