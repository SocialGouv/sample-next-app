import { Secret } from "kubernetes-models/v1/Secret";
import { createSecret } from "./create";
import { Params } from "./params";
export declare const create: (params: Params) => {
    createSecret: Secret;
};
