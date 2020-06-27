import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";

const params = env.component("hasura");
const { deployment, ingress, service } = create(params);

// todo ?
const PG_HOST = "samplenextappdevserver.postgres.database.azure.com";

//
ok(process.env.CI_ENVIRONMENT_NAME);
if (
  process.env.CI_ENVIRONMENT_NAME.endsWith("-dev") ||
  process.env.CI_ENVIRONMENT_NAME.endsWith("prod")
) {
  // HACK(douglasduteil): our cluster v1 is not supporting the `startupProbe`
  // Our cluster v1 is stuck in k8s v1.14 :(
  delete deployment.spec!.template.spec!.containers[0].startupProbe;
}

//

const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production",
    HASURA_GRAPHQL_ENABLE_CONSOLE: "false",
    HASURA_GRAPHQL_SERVER_PORT: "80",
    HASURA_GRAPHQL_ENABLED_LOG_TYPES:
      "startup, http-log, webhook-log, websocket-log, query-log",
    HASURA_GRAPHQL_NO_OF_RETRIES: "5",
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous",
    ACCOUNT_EMAIL_WEBHOOK_URL: "http://app:3000/api/webhooks/account",
    HASURA_GRAPHQL_JWT_SECRET:
      '{"type":"RS256","key":"-----BEGIN PUBLIC KEY-----\\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyY1EP+OUFipUuogV+2H5\\ndrOTtJS1E6HzXd7WaKHUlXEmvEPVDLI2RDU7Lno12EuFmtz+mtwXXSGzFCSfMI+8\\n84bCAL5SpJ1jpM3vMGRMIV0Qj3I06jdQEDhDUDapmkSXy1WuGEZOqSTxQ0DAW+vj\\nTorDhyslyWqLGwXZ73ikuQ94/3g34L9tHVez+e6M2DGODAdCnfR1g0rRByV5SIPf\\ncrG4I+vnSK9riuxWYCxtD7mFn2Trvp+rVejj47/yydY8fAVgPSrSREuOVb87XPwP\\n4a46ZEZK1SGiKsQlWyxUnEDNGgHaGG9zxe65IFulFZ2YDRMt9OCT6q2Di+s9+4GM\\n5mZGmeYkgYS7Wmz6XCEPWAnXzHPHmPdXu4u46jFmvkL//sfMxs8GbFCoyEyfoPhb\\nZxthfn00qWYJFE7xryYE3R7gVfyyTZCzypUNtePvEd2WzgJPSPgLbgrhXQcirIZl\\nvjXP5nSM/9rk3sOB1V93QiZlVah8EPbgkzpwlLVGL7ohYyKovwvZ7zjGpRPWuaH5\\nYZ5Neqvo3nuCPnqGSZKDuEuI27mgCdvQWa7XO1OO+tXB/p9JlUx+/eZB3N1eyXIe\\nxm4wgcSUsFkreCivnyaE4yG1ArixBvk1S1CP2YCnKF/q2BjJaUJzRMjnDr3kd9wi\\n3n2+OQJ4KBgBu/TtFzWtKj0CAwEAAQ==\\n-----END PUBLIC KEY-----"}',
    HASURA_GRAPHQL_ADMIN_SECRET: "someDummySecret",
  },
});

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: {
      name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  },
  {
    secretRef: {
      name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  },
  //   {
  //     secretRef: { name: `azure-pg-user` },
  //   },
];

if (process.env.ENABLE_AZURE_POSTGRES) {
  deployment.spec!.template.spec!.containers[0].envFrom.push({
    secretRef: {
      name: `azure-pg-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    },
  });
  //();
  // (deployment.spec!.template.spec!.containers[0].env = [
  //   {
  //     name: "HASURA_GRAPHQL_DATABASE_URL",
  //     // from  create-db
  //     // todo: extract to some secret
  //     value: `postgresql://user_${process.env.CI_COMMIT_SHORT_SHA}%40${PG_HOST}:password_${process.env.CI_COMMIT_SHORT_SHA}@${PG_HOST}/autodevops_${process.env.CI_COMMIT_SHORT_SHA}?sslmode=require`,
  //   },
  // ])
}

//

export default [deployment, ingress, service, envConfigMap];
