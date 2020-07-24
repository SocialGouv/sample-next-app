import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

//const params = env.component("app");
const manifests = create();

console.log("manifests", manifests);

export default manifests;
