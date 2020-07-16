import env from "./index";

test.each([
  ["because of missing variables", {}],
  [
    "because of empty strings",
    {
      CI_COMMIT_TAG: "",
      CI_ENVIRONMENT_NAME: "",
      CI_ENVIRONMENT_SLUG: "",
      CI_PROJECT_NAME: "",
      CI_PROJECT_PATH_SLUG: "",
      KUBE_INGRESS_BASE_DOMAIN: "",
      KUBE_NAMESPACE: "",
      PRODUCTION: "",
    },
  ],
])("should throw %s", (_: string, testEnv?: NodeJS.ProcessEnv) => {
  expect(() => env(testEnv)).toThrowErrorMatchingSnapshot();
});

const validEnv = {
  CI_ENVIRONMENT_NAME: "fabrique-dev",
  CI_ENVIRONMENT_SLUG: "my-test",
  CI_PROJECT_NAME: "sample",
  CI_PROJECT_PATH_SLUG: "socialgouv-sample",
  CI_REGISTRY_IMAGE: "registry.gitlab.factory.social.gouv.fr/socialgouv/sample",
  KUBE_INGRESS_BASE_DOMAIN: "dev.fabrique.social.gouv.fr",
  KUBE_NAMESPACE: "sample-42-my-test",
};
test.each([
  ["the gitlab global env", { ...validEnv }],
  [
    "tagged gitlab global env",
    {
      ...validEnv,
      CI_COMMIT_TAG: "vX.Y.Z",
    },
  ],
  [
    "production gitlab global env",
    {
      ...validEnv,
      CI_COMMIT_TAG: "vX.Y.Z",
      PRODUCTION: "true",
    },
  ],
])("should return %s", (_: string, testEnv?: NodeJS.ProcessEnv) => {
  expect(env(testEnv)).toMatchSnapshot();
});
