import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { NonEmptyString } from "@socialgouv/kosko-charts/utils/NonEmptyString";
import { onDecodeError } from "@socialgouv/kosko-charts/utils/onDecodeError";
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as D from "io-ts/lib/Decoder";

const GitlabProcessEnv = pipe(
  D.type({
    CI_ENVIRONMENT_NAME: NonEmptyString,
    CI_ENVIRONMENT_SLUG: NonEmptyString,
    CI_PROJECT_NAME: NonEmptyString,
    CI_PROJECT_PATH_SLUG: NonEmptyString,
    KUBE_INGRESS_BASE_DOMAIN: NonEmptyString,
    KUBE_NAMESPACE: NonEmptyString,
  }),
  D.intersect(
    D.partial({
      CI_COMMIT_TAG: NonEmptyString,
      PRODUCTION: D.string,
    })
  )
);

type GitlabProcessEnv = D.TypeOf<typeof GitlabProcessEnv>;

const mapper = ({
  CI_COMMIT_TAG,
  CI_ENVIRONMENT_NAME,
  CI_ENVIRONMENT_SLUG,
  CI_PROJECT_NAME,
  CI_PROJECT_PATH_SLUG,
  KUBE_INGRESS_BASE_DOMAIN,
  KUBE_NAMESPACE,
  PRODUCTION,
}: GitlabProcessEnv): GlobalEnvironment => {
  const isProductionCluster = Boolean(PRODUCTION);
  const application = isProductionCluster
    ? CI_PROJECT_NAME
    : CI_COMMIT_TAG
    ? `${CI_COMMIT_TAG.replace(/\./g, "-")}-${CI_PROJECT_NAME}`
    : `${CI_ENVIRONMENT_SLUG}-${CI_PROJECT_NAME}`;

  return {
    annotations: {
      "app.gitlab.com/app": CI_PROJECT_PATH_SLUG,
      "app.gitlab.com/env": CI_ENVIRONMENT_SLUG,
      "app.gitlab.com/env.name": CI_ENVIRONMENT_NAME,
    },
    domain: KUBE_INGRESS_BASE_DOMAIN,
    labels: {
      application,
      owner: CI_PROJECT_NAME,
      team: CI_PROJECT_NAME,
    },
    namespace: {
      name: isProductionCluster ? CI_PROJECT_NAME : KUBE_NAMESPACE,
    },
    subdomain: isProductionCluster ? CI_PROJECT_NAME : application,
  };
};

export default (env = process.env): GlobalEnvironment =>
  pipe(env, GitlabProcessEnv.decode, fold(onDecodeError, mapper));
