"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecret = void 0;
const Secret_1 = require("kubernetes-models/v1/Secret");
const metadata_1 = require("../app/metadata");
// create the azure-pg-user secret for dynamic environments (dev)
exports.createSecret = ({ database, user, password, host, sslmode = "require", ...params }) => {
    const connectionString = `postgresql://${user}%40${host}:${password}@${host}/${database}?sslmode=require`.toString();
    const secret = new Secret_1.Secret({
        metadata: {
            ...metadata_1.metadataFromParams(params),
        },
        stringData: {
            DATABASE_URL: connectionString,
            HASURA_GRAPHQL_DATABASE_URL: connectionString,
            PGDATABASE: database,
            PGHOST: host,
            PGPASSWORD: password,
            PGSSLMODE: sslmode,
            PGUSER: `${user}@${host}`,
        },
    });
    return secret;
};
//# sourceMappingURL=create.js.map