import { Job } from "kubernetes-models/batch/v1/Job";
import { createDbJob } from "./create-db.job";
import { Params } from "./params";
export declare const create: (params: Params) => {
    createDbJob: Job;
};
