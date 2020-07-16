import { Secret } from "kubernetes-models/v1/Secret";
import { Params } from "./params";
export declare const createSecret: ({ database, user, password, host, sslmode, ...params }: Params) => Secret;
