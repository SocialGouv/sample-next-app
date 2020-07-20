import { create } from "@socialgouv/kosko-charts/components/namespace";
import env from "@kosko/env";

const params = env.component("namespace");
console.log("NAMESPACE PARAMS", params);
console.log("\nKUBE_NAMESPACE", process.env.KUBE_NAMESPACE, "\n");
const params2 = {
  annotations: {
    "app.gitlab.com/app": "socialgouv-sample-next-app",
    "app.gitlab.com/env": "beta-db-12-dev2",
    "app.gitlab.com/env.name": "beta-db-12-dev2",
    "field.cattle.io/creatorId": "gitlab",
    "field.cattle.io/projectId": "c-f8qps:p-46tj7",
    "git/branch": "beta-db-12",
    "git/remote": "",
  },
  domain: "dev2.fabrique.social.gouv.fr",
  labels: {
    application: "beta-db-12-dev2-sample-next-app",
    owner: "sample-next-app",
    team: "sample-next-app",
    cert: "wildcard",
  },
  namespace: { name: "sample-next-app-85-beta-db-12-dev2" },
  subdomain: "beta-db-12-dev2-sample-next-app",
};
const { namespace } = create(params2);

export default [namespace];
