import { create as createApp } from "@socialgouv/kosko-charts/components/app";
import { create as createNamespace } from "@socialgouv/kosko-charts/components/namespace";
import gitlabGlobalEnv from "@socialgouv/kosko-charts/environments/gitlab";
import gitlabAppEnv from "@socialgouv/kosko-charts/environments/gitlab/app";
import gitlabNamespaceEnv from "@socialgouv/kosko-charts/environments/gitlab/namespaces";
import { merge } from "@socialgouv/kosko-charts/utils/merge";

export function create(env = process.env) {
  const globalParams = gitlabGlobalEnv(env);

  const namespaceParams = gitlabNamespaceEnv(env);
  const { namespace } = createNamespace(merge(globalParams, namespaceParams));

  const appParams = gitlabAppEnv(env);
  const { deployment, ingress, service } = createApp(
    merge(globalParams, appParams)
  );

  return [namespace, deployment, ingress, service];
}
