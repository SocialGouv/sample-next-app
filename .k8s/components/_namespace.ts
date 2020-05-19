import { create } from "@socialgouv/kosko-charts/components/namespace";
import env from "@kosko/env";

const params = env.component("namespace");
const { namespace } = create(params);

export default [namespace];
