import { onDecodeError } from "@socialgouv/kosko-charts/utils/onDecodeError";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Secret } from "kubernetes-models/v1/Secret";

import { createSecret } from "./create";
import { Params, PostresSecretParameters } from "./params";

const mapper = (params: Params): { createSecret: Secret } => ({
  createSecret: createSecret(params),
});

export const create = (params: Params): { createSecret: Secret } =>
  pipe(
    params,
    PostresSecretParameters.decode,
    fold(onDecodeError, () => mapper(params))
  );
