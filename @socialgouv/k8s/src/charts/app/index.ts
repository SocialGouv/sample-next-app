import { Config } from "../../Config";

import createDeployment from "./deployment";
import createIngress from "./ingress";
import { Params } from "./params";
// import { AppComponentParams, Params } from "./params";
// import createService from "./service";

export class App {
  deployment = createDeployment(this.name, this.config, this.params);
  ingress = createIngress(this.name, this.config, this.params);
  constructor(
    public name: string,
    public config: Config,
    public params: Params
  ) {
    params.deployment.spec.template.spec.containers[0].image =
      params.deployment.spec.template.spec.containers[0].image ??
      `${config.registry}/${name}:${this.tag}`;

    // this.service = createService(config);
    // this.configMap = createService(config);
    // this.secret = createService(config);
  }

  get tag() {
    return this.config.commitTag
      ? this.config.commitTag.slice(1) // remove "v" prefix
      : this.config.commitSha;
  }
}
