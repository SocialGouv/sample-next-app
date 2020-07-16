import { Service } from "kubernetes-models/v1/Service";

import { matchLabelsFromParams } from "./matchLabels";
import { metadataFromParams } from "./metadata";
import { Params } from "./params";

export default (params: Params): Service => {
  const metadata = metadataFromParams(params);

  return new Service({
    metadata,
    spec: {
      ports: [
        {
          port: params.servicePort,
          targetPort: params.containerPort,
        },
      ],
      selector: matchLabelsFromParams(params),
      type: "ClusterIP",
    },
  });
};
