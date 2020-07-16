import { onDecodeError } from "@socialgouv/kosko-charts/utils/onDecodeError";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Ingress } from "kubernetes-models/extensions/v1beta1/Ingress";
import { Service } from "kubernetes-models/v1/Service";

import createDeployment from "./deployment";
import createIngress from "./ingress";
import { AppComponentParams, Params } from "./params";
import createService from "./service";

const mapper = (
  params: Params
): { deployment: Deployment; ingress: Ingress; service: Service } => ({
  deployment: createDeployment(params),
  ingress: createIngress(params),
  service: createService(params),
});

export const create = (
  params: Params
): { deployment: Deployment; ingress: Ingress; service: Service } =>
  pipe(
    params,
    AppComponentParams.decode,
    fold(onDecodeError, () => mapper(params))
  );
