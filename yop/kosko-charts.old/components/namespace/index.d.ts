import { GlobalEnvironment, NamespaceComponentEnvironment } from "@socialgouv/kosko-charts/types";
import { Namespace } from "kubernetes-models/v1/Namespace";
export declare type Params = NamespaceComponentEnvironment & GlobalEnvironment;
export declare const create: (params: Params) => {
    namespace: Namespace;
};
