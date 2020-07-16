import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/namespace";

const { namespace } = create(env.component("namespace"));

export default [namespace];
