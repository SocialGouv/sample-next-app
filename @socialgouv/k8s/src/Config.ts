import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

export class Config {
  constructor(env = process.env) {
    this.namespace = {
      metadata: {},
    };

    this.app = {
      metadata: {},
      domain: "",
      subdomain: "",
    };
  }
  app: {
    metadata: IIoK8sApimachineryPkgApisMetaV1ObjectMeta;
    domain: string;
    subdomain: string;
  };
  namespace: { metadata: IIoK8sApimachineryPkgApisMetaV1ObjectMeta };
  registry: string = "";
}
