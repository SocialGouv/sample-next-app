import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { merge } from "@socialgouv/kosko-charts/utils/merge";

import { create } from "./index";
import { AppComponentEnvironment, Params } from "./params";

test.each([
  ["because of missing variables", {} as Params],
  [
    "because the containerPort is not an integer",
    {
      containerPort: 1234.56789,
      image: { name: "image_name", tag: "image_tag" },
      namespace: { name: "sample-42-my-test" },
      servicePort: 1234.56789,
    } as Params,
  ],
])("should throw %s", (_: string, params: Params) => {
  expect(() => create(params)).toThrowErrorMatchingSnapshot();
});

const validParams: Params = {
  containerPort: 1234,
  domain: "fabrique.social.gouv.fr",
  image: { name: "image_name", tag: "image_tag" },
  name: "app_name",
  namespace: { name: "namespace_name" },
  servicePort: 5678,
  subdomain: "sample",
};
test.each([
  ["a deployment, an ingress and service", {}],
  [
    "the models with global params in it",
    merge(
      {
        annotations: {
          "app.gitlab.com/app": "socialgouv-sample",
          "app.gitlab.com/env": "my-test",
        },
        domain: "fabrique.social.gouv.fr",
        ingress: {
          annotations: {
            "certmanager.k8s.io/cluster-issuer": undefined,
            "kubernetes.io/tls-acme": undefined,
          },
          secretName: "wildcard-crt",
        },
        labels: {
          application: "sample",
          owner: "sample",
          team: "sample",
        },
        namespace: { name: "sample-42-my-test" },
        subdomain: "sample",
      } as GlobalEnvironment,
      {
        containerPort: 1234,
        image: { name: "image_name", tag: "image_tag" },
        ingress: {
          secretName: "sample-crt",
        },
        name: "app_name",
        servicePort: 5678,
        subdomain: "my.sample",
      } as AppComponentEnvironment
    ),
  ],
])("should return %s", (_: string, params: Partial<Params>) => {
  expect(create({ ...validParams, ...params })).toMatchSnapshot();
});
