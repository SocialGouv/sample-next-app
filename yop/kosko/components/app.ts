import { create } from "@socialgouv/kosko-charts/components/app";
import gitlabGlobalEnv from "@socialgouv/kosko-charts/environments/gitlab";
import gitlabAppEnv from "@socialgouv/kosko-charts/environments/gitlab/app";
import { merge } from "@socialgouv/kosko-charts/utils/merge";

console.log("ENV:", process.env);

const appParams = gitlabAppEnv(process.env);
const globalParams = gitlabGlobalEnv(process.env);

const { deployment, ingress, service } = create(merge(globalParams, appParams));
const namespace = { name: "toto" };
export default [namespace, deployment, ingress, service];
