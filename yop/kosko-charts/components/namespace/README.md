# Namespace Component

## Usage

Import the default namespace component template.
We recommend that you prefix the namespace to ensure that kosko render it first.

```ts
// in .k8s/components/_namespace.ts
import { create } from "@socialgouv/kosko-charts/components/namespace";
import env from "@kosko/env";

const { namespace } = create(env.component("namespace"))
export default [namespace];
```

You can customize it

```ts
// in .k8s/components/_namespace.ts
import { Namespace } from "kubernetes-models/v1/Namespace";
import { create } from "@socialgouv/kosko-charts/components/namespace";
import env from "@kosko/env";

const params = env.component("namespace");
const base = create(params);
const namespace = new Namespace({
  ...base,
  labels: {
    ...base.labels,
    extra: "foo-bar-label",
    foo: params.bar,
  },
});
export default [namespace];
```
