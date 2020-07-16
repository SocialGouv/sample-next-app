import { onDecodeError } from "@socialgouv/kosko-charts/utils/onDecodeError";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Job } from "kubernetes-models/batch/v1/Job";

import { createDbJob } from "./create-db.job";
import { CreateDbComponentParams, Params } from "./params";

const mapper = (params: Params): { createDbJob: Job } => ({
  createDbJob: createDbJob(params),
});

export const create = (params: Params): { createDbJob: Job } =>
  pipe(
    params,
    CreateDbComponentParams.decode,
    fold(onDecodeError, () => mapper(params))
  );
