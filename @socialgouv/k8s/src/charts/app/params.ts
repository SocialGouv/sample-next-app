import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { Integer } from "@socialgouv/kosko-charts/utils/Integer";
import { NonEmptyString } from "@socialgouv/kosko-charts/utils/NonEmptyString";
import { pipe } from "fp-ts/lib/pipeable";
import * as D from "io-ts/lib/Decoder";

export const AppComponentParams = pipe(
  D.type({
    containerPort: Integer,
    image: D.type({
      name: NonEmptyString,
      tag: NonEmptyString,
    }),
    name: D.string,
    namespace: D.type({
      name: NonEmptyString,
    }),
    servicePort: Integer,
  }),
  D.intersect(
    D.partial({
      ingress: D.partial({
        secretName: D.string,
      }),
      labels: D.record(D.string),
      limits: D.type({ cpu: D.string, memory: D.string }),
      requests: D.type({ cpu: D.string, memory: D.string }),
    })
  )
);

export type AppComponentEnvironment = Omit<
  D.TypeOf<typeof AppComponentParams>,
  "namespace"
>;
export type Params = AppComponentEnvironment & GlobalEnvironment;
