"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbJob = void 0;
const metadata_1 = require("@socialgouv/kosko-charts/components/app/metadata");
const Job_1 = require("kubernetes-models/batch/v1/Job");
const DEFAULT_EXTENSIONS = "hstore pgcrypto citext";
// needs azure-pg-admin-user secret
exports.createDbJob = ({ database, user, password, extensions = DEFAULT_EXTENSIONS, ...params }) => {
    const job = new Job_1.Job({
        metadata: {
            ...metadata_1.metadataFromParams(params),
        },
        spec: {
            backoffLimit: 0,
            template: {
                spec: {
                    containers: [
                        {
                            command: ["create-db-user"],
                            env: [
                                {
                                    name: "NEW_DB_NAME",
                                    value: database,
                                },
                                {
                                    name: "NEW_USER",
                                    value: user,
                                },
                                {
                                    name: "NEW_PASSWORD",
                                    value: password,
                                },
                                {
                                    name: "NEW_DB_EXTENSIONS",
                                    value: extensions,
                                },
                            ],
                            envFrom: [
                                {
                                    secretRef: {
                                        name: `azure-pg-admin-user`,
                                    },
                                },
                            ],
                            image: "registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:0.28.0",
                            imagePullPolicy: "IfNotPresent",
                            name: "create-db-user",
                            resources: {
                                limits: {
                                    cpu: "300m",
                                    memory: "256Mi",
                                },
                                requests: {
                                    cpu: "100m",
                                    memory: "64Mi",
                                },
                            },
                        },
                    ],
                    restartPolicy: "Never",
                },
            },
        },
    });
    return job;
};
//# sourceMappingURL=create-db.job.js.map