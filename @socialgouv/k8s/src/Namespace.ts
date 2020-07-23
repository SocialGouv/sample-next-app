import { Namespace as K8SNamespace } from "kubernetes-models/v1/Namespace";
import { Config } from "./Config";
import { ok } from "assert";

export class Namespace extends K8SNamespace {
  constructor(config: Config) {
    super();

    ok(
      config.namespace.metadata.name,
      "Missing config.namespace.metadata.name"
    );

    this.metadata = {
      name: config.namespace.metadata.name,
      annotations: config.namespace.metadata.annotations,
      labels: {
        app: config.namespace.metadata.name,
        ...config.namespace.metadata.labels,
      },
    };
  }
}
