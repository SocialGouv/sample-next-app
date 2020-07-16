"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NonEmptyString_1 = require("@socialgouv/kosko-charts/utils/NonEmptyString");
const onDecodeError_1 = require("@socialgouv/kosko-charts/utils/onDecodeError");
const Either_1 = require("fp-ts/lib/Either");
const pipeable_1 = require("fp-ts/lib/pipeable");
const D = tslib_1.__importStar(require("io-ts/lib/Decoder"));
const GitlabProcessEnv = pipeable_1.pipe(D.type({
    CI_ENVIRONMENT_NAME: NonEmptyString_1.NonEmptyString,
    CI_ENVIRONMENT_SLUG: NonEmptyString_1.NonEmptyString,
    CI_PROJECT_NAME: NonEmptyString_1.NonEmptyString,
    CI_PROJECT_PATH_SLUG: NonEmptyString_1.NonEmptyString,
    KUBE_INGRESS_BASE_DOMAIN: NonEmptyString_1.NonEmptyString,
    KUBE_NAMESPACE: NonEmptyString_1.NonEmptyString,
}), D.intersect(D.partial({
    CI_COMMIT_TAG: NonEmptyString_1.NonEmptyString,
    PRODUCTION: D.string,
})));
const mapper = ({ CI_COMMIT_TAG, CI_ENVIRONMENT_NAME, CI_ENVIRONMENT_SLUG, CI_PROJECT_NAME, CI_PROJECT_PATH_SLUG, KUBE_INGRESS_BASE_DOMAIN, KUBE_NAMESPACE, PRODUCTION, }) => {
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
exports.default = (env = process.env) => pipeable_1.pipe(env, GitlabProcessEnv.decode, Either_1.fold(onDecodeError_1.onDecodeError, mapper));
//# sourceMappingURL=index.js.map