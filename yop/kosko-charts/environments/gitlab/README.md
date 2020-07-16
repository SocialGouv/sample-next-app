# GitLab Environments

> The GitLab focus environments.

## [`GitLabGlobalEnvironment`](./index.ts)

> extends [`GlobalEnvironment`](./../types/index.ts)

### Usage

Import the gitlab global environment object.

```ts
// in .k8s/environments/_base/index.ts
import gitlab from "@socialgouv/kosko-charts/environments/gitlab";

export default gitlab(process.env);
```

You can customize it

```ts
// in .k8s/environments/_base/index.ts
import gitlab from "@socialgouv/kosko-charts/environments/gitlab";

export default {
  ...gitlab(process.env),
};
```

### Requirements

As this environment is meant to be used in GitLab, some environment variables are expected.

| Variable                   | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `CI_COMMIT_TAG`            | (optional) The commit tag name\*                                           |
| `CI_ENVIRONMENT_NAME`      | The name of the environment for this job\*                                 |
| `CI_ENVIRONMENT_SLUG`      | A simplified version of the environment name\*                             |
| `CI_PROJECT_NAME`          | The name of the directory for the project that is currently being built\*  |
| `CI_PROJECT_PATH_SLUG`     | A simplified version of the namespace with project name\*                  |
| `KUBE_INGRESS_BASE_DOMAIN` | The domain of the cluster\*\*                                              |
| `KUBE_NAMESPACE`           | The namespace associated with the project’s deployment service account\*\* |
| `PRODUCTION`               | (optional) If set we are in production (on the production cluster)         |

\*: see https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
\*\*: see https://docs.gitlab.com/ee/user/project/clusters/index.html#deployment-variables

## [`GitLabNamespaceComponentEnvironment`](./namespaces.ts)

> extends [`NamespaceComponentEnvironment`](./../types/index.ts)

### Usage

Import the gitlab namespace component environment object.

```ts
// in .k8s/environments/_base/namespaces.ts
import gitlab from "@socialgouv/kosko-charts/environments/gitlab/namespaces";

export default gitlab(process.env);
```

You can customize it

```ts
// in .k8s/environments/_base/namespaces.ts
import gitlab from "@socialgouv/kosko-charts/environments/gitlab/namespaces";

export default {
  ...gitlab(process.env),
};
```

### Requirements

As this environment is meant to be used in GitLab, some environment variables are expected.

| Variable             | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `RANCHER_PROJECT_ID` | (optional) The rancher project id                              |
| `CI_COMMIT_REF_NAME` | (optional) The branch or tag name for which project is built\* |
| `CI_REPOSITORY_URL`  | (optional) The URL to clone the Git repository\*               |

\*: see https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
