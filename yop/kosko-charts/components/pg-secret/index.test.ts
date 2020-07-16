import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

import { create } from "./index";
import { Params, PostresSecretParameters } from "./params";

test.each([
  ["because of missing variables", {} as Params],
  ["because of missing variables", { user: "zorro" } as Params],
  [
    "because of missing variables",
    { database: "", host: "pouet.com", password: "", user: "" } as Params,
  ],
])("should throw %s", (_: string, params: Params) => {
  expect(() => create(params)).toThrowErrorMatchingSnapshot();
});

const validParams: PostresSecretParameters = {
  database: "some-db",
  host: "pouet.com",
  name: "test-job",
  password: "passw0rd",
  user: "tester",
};

const globalParams: GlobalEnvironment = {
  domain: "",
  namespace: { name: "sample-42-my-test" },
  subdomain: "",
};

test("should return a new PG secret", () => {
  expect(
    create({
      ...globalParams,
      ...validParams,
    })
  ).toMatchSnapshot();
});
