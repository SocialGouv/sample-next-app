import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/app";

const { deployment, ingress, service } = create(env.component("www"));
export default [deployment, ingress, service];
