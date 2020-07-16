import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta } from "kubernetes-models/_definitions/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

export interface SocialGouvAppParams {
  namespace?: {
    name: IIoK8sApimachineryPkgApisMetaV1ObjectMeta["name"];
    annotations: IIoK8sApimachineryPkgApisMetaV1ObjectMeta["annotations"];
    domain: string;
    labels: IIoK8sApimachineryPkgApisMetaV1ObjectMeta["labels"];
  };
}
