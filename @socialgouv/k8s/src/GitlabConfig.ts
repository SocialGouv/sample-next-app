import { Config } from "./Config";
import { ok } from "assert";

export class GitlabConfig extends Config {
  constructor(env = process.env) {
    super(env);

    this.namespace.metadata = {
      name: env.CI_PROJECT_NAME,
      annotations: {
        // Fake rancher namespace creation
        ...{
          "field.cattle.io/creatorId": "gitlab",
          "field.cattle.io/projectId": env.RANCHER_PROJECT_ID ?? "",
        },

        // Add git metadata to be able to auto destroy that namespaces
        // see https://github.com/SocialGouv/docker/tree/v0.18.0/k8s-ns-killer
        ...{
          "git/branch": env.CI_COMMIT_REF_NAME ?? "",
          "git/remote": env.CI_REPOSITORY_URL ?? "",
        },
      },
      labels: {
        cert: "wildcard",
      },
    };

    const isProductionCluster = Boolean(env.PRODUCTION);
    ok(env.CI_PROJECT_PATH_SLUG, "Missing env.CI_PROJECT_PATH_SLUG");
    ok(env.CI_ENVIRONMENT_SLUG, "Missing env.CI_ENVIRONMENT_SLUG");
    ok(env.CI_ENVIRONMENT_NAME, "Missing env.CI_ENVIRONMENT_NAME");
    ok(env.CI_PROJECT_NAME, "Missing env.CI_PROJECT_NAME");
    ok(env.KUBE_INGRESS_BASE_DOMAIN, "Missing env.KUBE_INGRESS_BASE_DOMAIN");
    const application = isProductionCluster
      ? env.CI_PROJECT_NAME
      : env.CI_COMMIT_TAG
      ? `${env.CI_COMMIT_TAG.replace(/\./g, "-")}-${env.CI_PROJECT_NAME}`
      : `${env.CI_ENVIRONMENT_SLUG}-${env.CI_PROJECT_NAME}`;

    this.app = {
      metadata: {
        annotations: {
          "app.gitlab.com/app": env.CI_PROJECT_PATH_SLUG,
          "app.gitlab.com/env": env.CI_ENVIRONMENT_SLUG,
          "app.gitlab.com/env.name": env.CI_ENVIRONMENT_NAME,
        },
        labels: {
          application,
          owner: env.CI_PROJECT_NAME,
          team: env.CI_PROJECT_NAME,
        },
      },
      domain: env.KUBE_INGRESS_BASE_DOMAIN,
      subdomain: application,
    };

    ok(env.CI_REGISTRY_IMAGE, "Missing env.CI_REGISTRY_IMAGE");
    this.registry = env.CI_REGISTRY_IMAGE;
  }
}
