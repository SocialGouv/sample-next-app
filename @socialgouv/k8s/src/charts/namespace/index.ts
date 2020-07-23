import { Namespace } from "kubernetes-models/v1/Namespace";

export interface Params {
  name: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

export const create = ({
  name,
  labels,
  annotations,
}: Params): { namespace: Namespace } => ({
  namespace: new Namespace({
    metadata: {
      annotations,
      labels: { app: name, ...labels },
      name: name,
    },
  }),
});
