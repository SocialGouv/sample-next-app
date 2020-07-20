const fs = require("fs");
const toml = require("toml");

const data = toml.parse(
  fs.readFileSync(`${__dirname}/../socialgouv.toml`, "utf-8")
);
console.dir(data);

const kosko = require("@kosko/generate");
console.log("GENERATE:", kosko);
const options = {
  path: "/Users/gvanwoerkens/Work/dsi/sample-next-app/.k8s/components",
  components: ["*"],
  require: ["ts-node/register"],
  baseEnvironment: "_base",
};

// console.log("\nKUBE_NAMESPACE", process.env.KUBE_NAMESPACE, "\n");

kosko.generate(options);
// import { generate, print, PrintFormat, Result } from "@kosko/generate";
// ****** MAPPER ******** { name: 'sample-next-app-85-beta-db-12-dev2' }

// $$$$$$$$$$ PARAMS $$$$$$$$$$ {
//   annotations: {
//     'app.gitlab.com/app': 'socialgouv-sample-next-app',
//     'app.gitlab.com/env': 'beta-db-12-dev2',
//     'app.gitlab.com/env.name': 'beta-db-12-dev2',
//     'field.cattle.io/creatorId': 'gitlab',
//     'field.cattle.io/projectId': 'c-f8qps:p-46tj7',
//     'git/branch': 'beta-db-12',
//     'git/remote': ''
//   },
//   domain: 'dev2.fabrique.social.gouv.fr',
//   labels: {
//     application: 'beta-db-12-dev2-sample-next-app',
//     owner: 'sample-next-app',
//     team: 'sample-next-app',
//     cert: 'wildcard'
//   },
//   namespace: { name: 'sample-next-app-85-beta-db-12-dev2' },
//   subdomain: 'beta-db-12-dev2-sample-next-app'
// }
