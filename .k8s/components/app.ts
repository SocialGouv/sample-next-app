import { create } from "@socialgouv/kosko-charts/components/app";
import env from "@kosko/env";

const params = env.component("app");
const { deployment, ingress, service } = create(params);

export default [deployment, ingress, service];
