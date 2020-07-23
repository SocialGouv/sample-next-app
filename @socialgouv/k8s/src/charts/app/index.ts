import { Config } from "../../Config";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

import createDeployment from "./deployment";
// import createIngress from "./ingress";
// import { AppComponentParams, Params } from "./params";
// import createService from "./service";

export class App {
  deployment: Deployment;
  constructor(name: string, config: Config) {
    const image = {
      name: `${config.registry}/${name}`,
      tag: config.COMMIT_TAG
        ? config.COMMIT_TAG.slice(1) // remove "v" prefix
        : config.COMMIT_SHA,
    };
    this.deployment = createDeployment(name, config);
    // this.ingress = createIngress(config);
    // this.service = createService(config);
    // this.configMap = createService(config);
    // this.secret = createService(config);
  }
}
