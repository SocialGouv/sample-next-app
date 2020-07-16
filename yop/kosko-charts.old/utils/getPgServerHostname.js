"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPgServerHostname = void 0;
const assert_1 = require("assert");
// dummy slugify - use "dev" server for "preprod" env too
exports.getPgServerHostname = (appName, env = "dev") => appName.toLowerCase().replace(/\W/g, "") +
    (env !== "prod" ? "dev" : "prod") +
    "server.postgres.database.azure.com";
assert_1.ok(exports.getPgServerHostname("sample-Next-App123", "preprod") ===
    "samplenextapp123devserver.postgres.database.azure.com");
//# sourceMappingURL=getPgServerHostname.js.map