import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Ingress } from "kubernetes-models/extensions/v1beta1/Ingress";
import { Service } from "kubernetes-models/v1/Service";
import { Params } from "./params";
export declare const create: (params: Params) => {
    deployment: Deployment;
    ingress: Ingress;
    service: Service;
};
