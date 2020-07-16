import { NamespaceComponentEnvironment } from "@socialgouv/kosko-charts/types";

export default (env = process.env): NamespaceComponentEnvironment => {
  return {
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
};
