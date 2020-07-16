import { create } from "./index";

test("should return a deployment, an ingress and service", () => {
  process.env.CI_ENVIRONMENT_NAME = "env-dev";
  process.env.CI_ENVIRONMENT_SLUG = "env-dev";
  process.env.CI_PROJECT_NAME = "kosko-chart";
  process.env.CI_PROJECT_PATH_SLUG = "socialgouv-kosko-chart";
  process.env.KUBE_INGRESS_BASE_DOMAIN = "dev2.fabrique.social.gouv.fr";
  process.env.KUBE_NAMESPACE = "kosko-chart-85-beta-db-12-dev2";
  process.env.CI_REGISTRY_IMAGE =
    "registry.gitlab.factory.social.gouv.fr/socialgouv/kosko-chart";
  process.env.CI_COMMIT_SHA = "c58c0974f7023063b1296d3a5a285b46b92771f8";
  expect(create()).toMatchSnapshot();
});
