import { Environment } from "@kosko/env/dist";

import { getEnvironmentComponent } from "./getEnvironmentComponent";

test("should load a envirement compoent", () => {
  const env = new Environment(".");
  const loader = jest.fn(() => "foo");
  expect(getEnvironmentComponent(env, "foo.yaml", { loader })).toStrictEqual(
    []
  );
});
