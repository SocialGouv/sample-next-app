import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/namespace";
// import gitlabGlobalEnv from "@socialgouv/kosko-charts/environments/gitlab";

// const globalParams = gitlabGlobalEnv(process.env);

const params = env.component("namespace");
console.log("params", params);
params.namespace = { name: "toto" };
const { namespace } = create(params);
console.log("namespace", namespace);

export default [namespace];
