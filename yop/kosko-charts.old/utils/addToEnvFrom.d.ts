import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";
interface AddToContainerParams {
    deployment: Deployment;
    data: EnvFromSource[];
    containerIndex?: number;
}
export declare const addToEnvFrom: ({ deployment, data, containerIndex, }: AddToContainerParams) => void;
export {};
