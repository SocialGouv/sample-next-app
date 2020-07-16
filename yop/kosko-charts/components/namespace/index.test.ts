import { create, Params } from "./index";

test.each([
  ["because of missing variables", {} as Params],
  [
    "because the namespace name is emptys",
    {
      namespace: { name: "" },
    } as Params,
  ],
])("should throw %s", (_: string, params: Params) => {
  expect(() => create(params)).toThrowErrorMatchingSnapshot();
});

const validParams: Params = {
  domain: "",
  namespace: { name: "sample-42-my-test" },
  subdomain: "",
};
test.each([
  ["a namespace", {}],
  [
    "a namespace with extra labels and annotations",
    {
      annotations: {
        "app.gitlab.com/app": "socialgouv-sample",
        "app.gitlab.com/env": "my-test",
      },
      labels: {
        application: "sample",
        owner: "sample",
        team: "sample",
      },
      namespace: { name: "sample-42-my-test" },
    },
  ],
])("should return %s", (_: string, params: Partial<Params>) => {
  expect(create({ ...validParams, ...params })).toMatchSnapshot();
});
