#!/usr/bin/env ts-node-script

// "use strict";

// const fs = require("fs");
import { readFileSync } from "fs";
import { parse } from "toml";

const data = parse(readFileSync("./socialgouv.toml", "utf-8"));
console.dir(data);

// export function create(env = process.env): void {
//   console.log("create");
//   const globalParams = gitlabGlobalEnv(env);

//   // const namespaceParams = gitlabNamespaceEnv(env);
//   // const { namespace } = createNamespace(merge(globalParams, namespaceParams));

//   // const appParams = gitlabAppEnv(env);
//   // const { deployment, ingress, service } = createApp(
//   //   merge(globalParams, appParams)
//   // );

//   // return [namespace, deployment, ingress, service];
// }
