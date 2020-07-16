# App Component

## Usage

Import the default app component template.

```ts
// in .k8s/components/app.ts
import { create } from "@socialgouv/kosko-charts/components/app";
import env from "@kosko/env";

const { deployment, ingress, service } = create(env.component("app"))
export default [deployment, ingress, service];
```

You can customize it

```ts
// in .k8s/components/app.ts
import { app } from "kubernetes-models/v1/app";
import { create } from "@socialgouv/kosko-charts/components/app";
import env from "@kosko/env";

const params = env.component("app");
const { deployment, ingress, service } = create(params)
deployment.spec.template.spec.containers[0].name = "foo"
export default [deployment, ingress, service ];
```
