import { createNamespace } from "@socialgouv/kosko-charts/utils/createNamespace";

const namespace = createNamespace();

// todo: use future kosko-charts
if (namespace && namespace.metadata) {
  namespace.metadata.labels = {
    ...namespace.metadata.labels,
    "azure-pg-admin-secret": "sample-next-app",
  };
}

export default namespace;
