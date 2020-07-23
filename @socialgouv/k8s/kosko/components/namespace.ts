import env from "@kosko/env";
import { create } from "@socialgouv/k8s/src/charts/namespace";

const { namespace } = create(env.component("namespace"));

export default [namespace];
