import { NamedComponentEnvironment } from "@socialgouv/kosko-charts/types";

export const matchLabelsFromParams = (
  params: NamedComponentEnvironment
): Record<string, string> => ({
  app: params.name,
});
