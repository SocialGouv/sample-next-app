import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("hasura");
const { deployment, ingress, service } = create(params);

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
/*
  envFrom:
    - configMapRef:
        name: hasura-env
    - secretRef:
        name: hasura-env
*/
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

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env-${process.env.CI_COMMIT_SHORT_SHA}`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
  spec: {
    encryptedData: {
      ACCOUNT_EMAIL_SECRET:
        "AgA8wmcTYdtsMQlSPr2PtJNzTreTJ2CLEsa0V/pK3WI6A87RBUJcrPKQJorlWV7U2/vG6s7YeEWn/4elgnCsIx0Heq05DilLNVFUHsFJ3NGbZ1pu279LNgvHa0jOVRnv7v2FFvDp0al+p0eMVtoU7+ovyXFqm/Mm761ZZX/7mU+2eERssgWZ4WqkXRJGe5C8jSqxg8/mz5zDzj1U+nGh5nzGhmJWp8pKhW6U17daFYAT/ixrN3TqN5a3y7DpKzV3Y4gHdyGmcxuTekninN3F37MGBtA3CJxKp8hY1pCu1Chte0VfZmBwvnuh6l/uTU2iErV8+VeKfW4mWbMJraX6lS+sfBMxBdXLlTXT2UmJREsnoYItgBYtpRZTeM2v0hZt9ScXyOJ/I8gBai+0yHwlLFnL4N7DOMzUfRa1UUFoJusDFSsFSmu64KMeGdU2dzf1jEiILzeBDhYT9QsWJx3/oquBsfDaxstOp0B7SRZn7QLywQvosfkCHtJeGafG5zmKn42htliChSjZPeVn0y1StXc11N4Wfgz3EyscCj1l0S3GtQEK0NJSO+hgACm9E2QaU1RlzFuzugdSz1UntmwR6NgVN5yLHADbanKo4LDS/Z8fN5m0qDVwP1Z99DkEE1P82bAs1T5sOn6ZrJiIhuFCHWouwYjvuMOhEoddL42VwuPg5G0rTtovn3a9c7FrmXY9lZWR4NGTMHMbNYc+UeCUkTA=",
      //      HASURA_GRAPHQL_ADMIN_SECRET:
      //     "AgCAqhKgc3PtqkQnkPeR0pAyh5bkICHiNpYkHBwRAhRCSo4kktC4p1/OJapMewk2glYBZHdUIad4JEn1V7/EvfMkWs7Eh7CXLYQB8xdJxbl7tyopNSppQxLA2YkMTPmnja5kGJrf2nvZNR1u7aQ7z5ZuP9KFzPsWTj/pFQiczsoyhNrKJmSeAUMRKophVfgKDdvNuM6ZEuSiR9iGhhrGJVD1gHlQaOW0JKCjweuC0opYdP/rlZOD6BvqzlaYc+dHVYbot7ktDzYT98YCIJdS0sKe0/6+L/CQgWeqAUxZxyPrtOk5BsBOXKNuXIrG9sQQ8SXSykubqYRGdClVv6TlazMXvBtuoind14bkJ1G4Are0FsokIPoJxrYAM1Nd4hKvRJvT3BiiEY2JdqRbmeHyZc+yCYUeUkvbtVIHFHGnSjVzAfriR6mLj4psmUGAtjq7qqaa6fJQb1fRr6pnb6//i6B6NjspyMHNi5uwLCn3Rvrqbq0abgtZCh1PUPZeqA/kAENyg3FunPzxiCdlHJnKch7lQDSkoQDukEGWipUnr9/ICfMuAMlu1uTHqjjGrsZoewqY00MHkPNyFiHVwYmEqY9INfmEH9G5UBLaWTorLyvleJUK60d8ZteFArZlskOs82gtcVhYGtE1TZ3VSn/sGKHdC53BlWJ5b65GKP8bn1xKmuu+ah3+NNWkgTydoKzTjHxOiX3FVeDHyVM9v3Xyv/6/Z8KCvRw9cgbmcX+PkTifzsT/10iGvP+aa/8+3tOmikLHHGpTyALG9YOZ4MPOHR5owd1xI0TUm++0+JgxYfeNny+Ybk0O0x/ikVx+gSDR7MKDD9sI2V6wX8cJKpl6hLFIxFV0EUCwHiWW0N5ZnXJarMMhMWzV+4YaD0c6ZxhDgizvIX6nOs0aEihvFBVBgZuiIiO3RW0fUDel0kcqzg==",
      //   HASURA_GRAPHQL_JWT_SECRET:
      //     "AgAnThMc6uuayn1BR4rLy65IoFDsv8pzBpphbYxf36e4OJooSi9s2upWe8g3HpVfdb5SthH77uw+64Ks+Tvku1gHrUOOXh89F+RS1mLwBfNhe4Nlf55AosasYsUOjE5mWOd0Czdp723ujL9T1SoZNyGeGyG2ZPxR+clgBJIgX5fRMvfi76SSq5trUasItHflHp+io2leMD8QBB0jukLf8vmHHCZ36S1hwtISj7NMHtiv4bl2AQPj6KjyO2U0AB+Uf+Un21RwCRsXv4mDkKNZAGSMn67IkqLRK02TFJQRz4qn+WrX4DPkgNG+fELYHBK0CSi8orSN07Z0qY4y86IYbXRiqJDDKIXq6jNQ2V3Ffox8uNNPk8BJ4lrxz4Bn9r9/rTWRLS70Uzv+OXViJ2xcb4HxBZFSKucOVK4Gx8kFf5xoKd6LV6g6kbjtYQUR4FGQihvZYsDrr5qGv1rxHO7EkY4o9Hre2iHVQJ08imfDoXscfzeJC9lxo/e5M7LusDtIkzwkMkmsv8WXMlGjfg4JoYiQzVA8oMsmeWQLHNdJUdSkZF8tFc3skvgYEeMuDi89KRiuCOwnShrVLzPzYbWO+7dwnyay5NVvtvNE9kXYn5U4EwGExeLGWoRRrDCOUM9sgwAJF7AcDcQUQ+MWupWacW7YE+VjBMuDmJR+1Gx9qDXGUspG1DkDfKqLCxT1L2RoMlbIfubACEYYbZ5IiooqjwbHCMUzbr4aRNSM2C3KqN8wSlB18xVfrgVpWYqZFtXWjJAgvLbn5Pi6ryaBPy/adnlBpGf1S2EakV9uR6gdpsKR1yTmzNT7MCIiInzvq/KijQCiJwAyqIkpU+tQv+HInHxWZQ==",
      // },
      template: {
        metadata: {
          ...metadataFromParams(params),
          name: `hasura-env-${process.env.CI_COMMIT_SHORT_SHA}`,
          annotations: {
            "sealedsecrets.bitnami.com/cluster-wide": "true",
          },
          creationTimestamp: null,
        },
      },
    },
  },
});

//

export default [secret, deployment, ingress, service, envConfigMap];
