import { Job } from "kubernetes-models/batch/v1/Job";
import { Params } from "./params";
export declare const createDbJob: ({ database, user, password, extensions, ...params }: Params) => Job;
