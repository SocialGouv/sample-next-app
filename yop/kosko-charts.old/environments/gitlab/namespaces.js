"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (env = process.env) => {
    var _a, _b, _c;
    return {
        annotations: {
            // Fake rancher namespace creation
            ...{
                "field.cattle.io/creatorId": "gitlab",
                "field.cattle.io/projectId": (_a = env.RANCHER_PROJECT_ID) !== null && _a !== void 0 ? _a : "",
            },
            // Add git metadata to be able to auto destroy that namespaces
            // see https://github.com/SocialGouv/docker/tree/v0.18.0/k8s-ns-killer
            ...{
                "git/branch": (_b = env.CI_COMMIT_REF_NAME) !== null && _b !== void 0 ? _b : "",
                "git/remote": (_c = env.CI_REPOSITORY_URL) !== null && _c !== void 0 ? _c : "",
            },
        },
        labels: {
            cert: "wildcard",
        },
    };
};
//# sourceMappingURL=namespaces.js.map