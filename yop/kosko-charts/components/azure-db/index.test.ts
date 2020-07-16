import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

import { create } from "./index";
import { CreateDbJobParameters, Params } from "./params";

test.each([
  ["because of missing variables", {} as Params],
  ["because of missing variables", { user: "zorro" } as Params],
  [
    "because of missing variables",
    { database: "", password: "", user: "" } as Params,
  ],
])("should throw %s", (_: string, params: Params) => {
  expect(() => create(params)).toThrowErrorMatchingSnapshot();
});

const validParams: CreateDbJobParameters = {
  database: "some-db",
  name: "test-job",
  password: "passw0rd",
  user: "tester",
};

const globalParams: GlobalEnvironment = {
  domain: "",
  namespace: { name: "sample-42-my-test" },
  subdomain: "",
};

test("should return a create-db job", () => {
  expect(
    create({
      ...globalParams,
      ...validParams,
    })
  ).toMatchSnapshot();
});

test("should use custom extensions", () => {
  expect(
    create({
      ...globalParams,
      ...validParams,
      extensions: "pgjwt",
    })
  ).toMatchSnapshot();
});
