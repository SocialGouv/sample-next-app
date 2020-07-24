import { IIoK8sApiCoreV1Container } from "kubernetes-models/_definitions/IoK8sApiCoreV1Container";
import { IIoK8sApiCoreV1ServiceSpec } from "kubernetes-models/_definitions/IoK8sApiCoreV1ServiceSpec";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Ingress } from "kubernetes-models/extensions/v1beta1/Ingress";
import { Service } from "kubernetes-models/v1/Service";
import { IIoK8sApiAppsV1DeploymentSpec } from "kubernetes-models/_definitions/IoK8sApiAppsV1DeploymentSpec";
import { IIoK8sApiCoreV1PodTemplateSpec } from "kubernetes-models/_definitions/IoK8sApiCoreV1PodTemplateSpec";
import { IIoK8sApiCoreV1PodSpec } from "kubernetes-models/_definitions/IoK8sApiCoreV1PodSpec";

export interface Params {
  deployment: Deployment & {
    spec: IIoK8sApiAppsV1DeploymentSpec & {
      template: IIoK8sApiCoreV1PodTemplateSpec & {
        spec: IIoK8sApiCoreV1PodSpec;
      };
    };
  };
  service: Service;
  ingress: Ingress & {};
}
