import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

export class Config {
  app: {
    metadata: IIoK8sApimachineryPkgApisMetaV1ObjectMeta;
  } = {
    metadata: {},
  };
  namespace: { metadata: IIoK8sApimachineryPkgApisMetaV1ObjectMeta } = {
    metadata: {},
  };
  registry: string = "";
  domain: string = "";
  subdomain: string = "";
  commitTag?: string;
  commitSha: string = "";
}
