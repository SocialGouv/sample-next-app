import {
  GlobalEnvironment,
  NamespaceComponentEnvironment,
} from "@socialgouv/kosko-charts/types";
import { NonEmptyString } from "@socialgouv/kosko-charts/utils/NonEmptyString";
import { onDecodeError } from "@socialgouv/kosko-charts/utils/onDecodeError";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as D from "io-ts/lib/Decoder";
import { Namespace } from "kubernetes-models/v1/Namespace";

export type Params = NamespaceComponentEnvironment & GlobalEnvironment;

const NamespaceComponentParams = pipe(
  D.type({
    namespace: D.type({
      name: NonEmptyString,
    }),
  }),
  D.intersect(
    D.partial({
      annotations: D.record(D.string),
      labels: D.record(D.string),
    })
  )
);
type NamespaceComponentParams = D.TypeOf<typeof NamespaceComponentParams>;

const mapper = ({
  namespace,
  labels,
  annotations,
}: Params): { namespace: Namespace } => ({
  namespace: new Namespace({
    metadata: {
      annotations,
      labels: { app: namespace.name, ...labels },
      name: namespace.name,
    },
  }),
});

export const create = (params: Params): { namespace: Namespace } =>
  pipe(
    params,
    NamespaceComponentParams.decode,
    fold(onDecodeError, () => mapper(params))
  );
