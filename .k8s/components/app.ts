import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("app");
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

const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production",
    FRONTEND_HOST: "${HOST}", // todo: for emails ?
    GRAPHQL_ENDPOINT: "http://hasura/v1/graphql",
    ACCOUNT_MAIL_SENDER: "contact@fabrique.social.gouv.fr",
    FRONTEND_PORT: "${PORT}",
    PRODUCTION: "false", // todo: override in prod
    HASURA_GRAPHQL_JWT_SECRET:
      '{"type":"RS256","key":"-----BEGIN PUBLIC KEY-----\\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyY1EP+OUFipUuogV+2H5\\ndrOTtJS1E6HzXd7WaKHUlXEmvEPVDLI2RDU7Lno12EuFmtz+mtwXXSGzFCSfMI+8\\n84bCAL5SpJ1jpM3vMGRMIV0Qj3I06jdQEDhDUDapmkSXy1WuGEZOqSTxQ0DAW+vj\\nTorDhyslyWqLGwXZ73ikuQ94/3g34L9tHVez+e6M2DGODAdCnfR1g0rRByV5SIPf\\ncrG4I+vnSK9riuxWYCxtD7mFn2Trvp+rVejj47/yydY8fAVgPSrSREuOVb87XPwP\\n4a46ZEZK1SGiKsQlWyxUnEDNGgHaGG9zxe65IFulFZ2YDRMt9OCT6q2Di+s9+4GM\\n5mZGmeYkgYS7Wmz6XCEPWAnXzHPHmPdXu4u46jFmvkL//sfMxs8GbFCoyEyfoPhb\\nZxthfn00qWYJFE7xryYE3R7gVfyyTZCzypUNtePvEd2WzgJPSPgLbgrhXQcirIZl\\nvjXP5nSM/9rk3sOB1V93QiZlVah8EPbgkzpwlLVGL7ohYyKovwvZ7zjGpRPWuaH5\\nYZ5Neqvo3nuCPnqGSZKDuEuI27mgCdvQWa7XO1OO+tXB/p9JlUx+/eZB3N1eyXIe\\nxm4wgcSUsFkreCivnyaE4yG1ArixBvk1S1CP2YCnKF/q2BjJaUJzRMjnDr3kd9wi\\n3n2+OQJ4KBgBu/TtFzWtKj0CAwEAAQ==\\n-----END PUBLIC KEY-----"}',
    HASURA_GRAPHQL_ADMIN_SECRET: "someDummySecret",
  },
});

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
  spec: {
    encryptedData: {
      // PGHOST:
      //   "AgAuIcvqwnbjEX8Be3e7XEGrz9yMzSd96+PZnh1sX91UoBdRNja0W4yrNiDDAidpChXRUZhvg+rxP4tludrVJd0i8mYuLwwhZ9KzE+BulwoOQmGQRmUt5H9g5NoOitJexsoCf8hja28SsobTB6YKBLcmdfcbVoD1Sr2/0//XXGoxanvz8n93bq1e5zauNbCwLyaegW0PCKE1v8L3A+Qr3NGrztq+TUBnYgkEPCONdGct1Q8/t/VdLPQ+EWkAejoQ2+dXy6YhGhbDqJT66IJjupuRVXSzJxOpMx0zcZ7EsZli4PMfdnUOtUwMnW2n257IejrVnZDbFbOqG82Q+4DaKfPolAjR5uUBWZIlyhK2Q5s87mzFuULPwvwvLJAew6gbKYsGQOkW527tRpltFyDMVUjAIAAfVh9+S2NQefQioHMdsT9RRBAtS+Lrap3B01PJqURT4wbso7eNSocI11YLBvZJNAXqUr9VfgjuzHkcNmhaVod+dz+mAmgZ45TyaM43qYl7rb4eu5CiH/vG7veuB0ogGepE9d36bnt0dDPGh/cBYGe3qIidIXfJaMx5nIWYps6Sbz/iLVng/6w1boX2vzMl8eS39KF5sXjpgn8dnkZL+TT0di1YL3YwBCGE4D8JNBdRRYBbVfvT4naWkqOlYmgnZQPtDxnnRIP7HGK/rbDU97CcR8c8JgSXRfUlHPw5nEc///r3VhcRRXRTb4jTFORgv4vhmw6aV8T6h6K2rrUDuiI9zmEsw0HYWabt6dfNwHfJ1w==",
      // PGPASSWORD:
      //   "AgASUydMV596hmu+lQV3MQiFQ2EHme7RNOLp2IldiC/gV5Ns5U5xxBNS4xUghNRybzUJ8WkwtmRPQXsbwL/vBM3V05WkY90Ept0fkkccMv/ktS/Ca9E6AzieiBtV1PCb2nvR0Dw6USW8Bbija447c0MLir18gOzrv9JaImxW1oGEPaWsX6O/fPBzslqCF4DqtTD93ginFnzzQ+rlsFWgZaXUE3LQ7JVQ8QiOyKOaT6LB7k//84gRwcBrNexv9+sT6sRl26E7TC+mF2BUEP1FwB/GxxkLW12eUu/S9FXeBWKce1BAN7z4s8kw0EZdPmn7xPEL1k6dpeiALn+ATz7Xeer5TteCctjtRYYiPLTKpCfRvGsJWOOOOgYGdaKcDNfZShj+j/k72Mv4b8ZS9pJCx9daRejFW3oyQfwMJc+qwjbOLKFDw0VyJH7Nxv90jmHE2xmA98xpUlGBlsGBVc0+ph0J1OxXOH0JMMgXCHAx4aprOlchPLBPNLcWP/0Mh4H6QVRSM2P4hjQG83drV0vKwzXPpmjWznnI5IrGEybRV6HrB1ft8pm2xylznshLOd/7ntLMJ5OwFDFdeJLa95/0359kW6zeGqBqCk1nv+/OBp57YzeFCV6e4cc5rSTP0P2Ti3IFCJ8uj/tDzase1M3JdnIzNBK+D1dbNa4ms4l7z3NerSnWSWFlxTBJCARuupMlWqPg6qVLajm6T6g+n2Rt7W9QPXUAIg3eiEv5GBlaHd1riSSxaRyCle88",
      // PGSSLMODE:
      //   "AgBq7Vlduz3B2lAUXZO8BRdgmmsx7FZIlwx+A4tXkMH/k+4wcIZidonOZT1xy/v1TLlbqOXnay7NS40e60dAV2LmIStkwHc43xyr5Bf/N99GDgFRKAOmPEdb6XjAyMtuuMdJr9slRPQC0rm+7ajhtFeFgQbedCJ2kv2JYVoHQeS9dn3NhmnWvnKHHSxwtjliFIqdkvP0Zc53j7sXJMmIibLQYR7EnkBHS6hA4NiqwHGUaBpKqKKeAPfOeiSzGFr3vpuSumtcge9dgzjbkwq+7+Xc5IyPFCAknFddyXkrywSTbUOauI13b+0idYvnbm4DPpHGnVGHiP1bmafceXgU1wP17lqkxY8wXwgmVfurGPj67MlkVa/3IhABaaa/Vy6DCrXtknqWw3vOi5NKOat7snyQ8pEXhNvUfA6kPjPtKM7Wsbv+MmNppv1EOZdLB7s+XQjQLvmijmRA1kaJwt9LwGb83WuLOgo19lGumQxz7kLW9V/JkRYZdkHLOgbvT60xs8mBYfqdB2hy5sU+KtHO8vcQx07S/mFbjf1Oi1+4fLCzE8r68Lxo8pI1ooopAhr3aU7HP3iRv9C1vt1o02cYODE3TEj2DYde1AN7GsZwuaNICyHIdo4Aim3ea3xhorm6qcBFmbC00K92i/WuRTjhbsIPOP1U5aZQgI9Fwvm70Wv9c+rKZSgHRPjrJNj9V/ZE2hnvBfC93YH0",
      // PGUSER:
      //   "AgCBG3dEfv8djRxoUPvt3j/SmAasZAgbMUIopq9Uc9fQ6iQS/XezaKixzrukm6kp3bfTYPLA1DVznuosQaqkvLQY6oW1fDUhmwnyWt5I3AOXM+Xnh1ulzoaQacegKT9Ka0cgiaZt1gExF0VtOLE6Vfbvvy6eGCK5P2uCQMqkdPjJXFxh8qufwbtY1ZekxaLEPJYqRw8bLD2R5TexpFMSc3V5uEUxdBhft0LeyLyemhYnpkptMCCLH79b8DsfMZxPvXknK5Acz08Hise+2WYOZnJZPgDENSj9umYp5/7ArHhiVgoBqBf1DwbYlSHdKppthag2D4NJRc4DYg5vwA9wXyCOvr8w3Q8XbAsgb5kPlgK0M2yYbuCiLOBjNtLPau27F9ua1tDr1SuLWW2WmAp0NccFVjQcWPsgzY9OB7Zx4VyhCLaLhHwtf/UuHJzaXuHv7HLirFveRQ5fJ4MvldLg+wlM5q7NIN46jvjb49bX3kYDfzR8UKDj8LY7rdfAV1yn9ri21IHbNtYvSapqivkAgiLEWDGPZmaFUOxZuoL6l0OxMMk2u8xxNwAmkpuGFtdaPpIOttdwv1GNV7024IHHQwzwn3zZlSAVIL8y8+/Z4ggwEVxH0+z+8Xh2sUUXF9NXQUFemTc9KYvBjAOvChO0poy0POYpwXPykrNEPk+pKzetd2bsTlCB/qPMmimxH5eO+RsafoL7GWZIU07CBjRmD79Z30nvcIYbPzJbSyQzSqfrSSpNUTf/2rLi6w==",
      SMTP_EMAIL_PASSWORD:
        "AgCxMpBOCaSzg1tWkIMIGNVLKjcvXO2XlliOiz5fT73kynG6NklT1melNRyhRvZeY1Ht2fH1AJAuHLxO8DRSWwXL4DcW0SM7Ly5rVyeTlTTmuP86RIP8MXAo0LlNBMQEzqnlE95sHsp1e1C0LxpjU4TaUvzGS9YVVBDBZVuq++uywcxtZDIr7FP1GBxSR/CEn6wv6xVlm1TVi0JqX0qwMNE0LMuWHW4Kn87fMpoRegMKHTHMetHzS+S1SKdKNNikYFKX2A8vrSE1iytRM+2X4OHNeOn9ZMT/0f8zl0NwOmPs2VodJxTBFZufbobw6r8l8MDSc3KymCNNqZN2311TesQRuojoprU6+NfPWWCoGvow2aKXDPZBqtnWCBCx40Z7Q5OYVmZKemkm1u03CUkew47ngpTU5ybg0JZQPgivmZ0OdD3enfhS09hfkxAISAs60hoCJSxglJ9ho0U3mNAOld5zWj+TByq2TJEp5oL1fg86UYsg1BHVNimAk68Oe31rOCrzAfYNzLZv/++Mws2mWVC8bB91sKCsaCpOVysRqbhkJ82nt0L3JG1lpO3jqN5JzvjHXvBaDaimyPZt0a3rDnCnABve9MGHzS/rxMeSDG2McX7LPATqS4JPOBpHfmYDI6ftsPl4T/krzILuGJLWVCAnI/78pErEzBUgJFIs94ysUG2D0DfZPESwYnfkchdT06ztCHP3NS8BxeWMTUKM",
      SMTP_EMAIL_USER:
        "AgDJtETLDZOMDOPm5BMgwExkPK1o7UIYTnx4lnJPvx+t6vw85qejusk0HH+eSXwVPfFjXO9+PxQ4dxWM5+AUFSeARmv/WIzmRpq5vxz5L3qe9+VlVfo3v3Uv4eQsiMrBAtzDsj52/tEYR4Tw+aSO33riq/eX8qWhzgfn9zKrUDwFj+M4BtpNDEjtjDACSE1KCq1a70hbO9ddBu66zfF9Y/Hif2Bt4QXuqaYzEreVWf3RDJknrdpmph0wLMLEhWJdNtImLSTGMu0YJ6Sh+dqSy283qqdQ4xY6egnfXSq7F7I28jBtWToAxMpDzFbFNgj22iEM1tpJFp4Z8Cmv1AZ1k1m6QF5bNoZY5vTBdmdOurF6/I0C5Q3IPas92KyIOIEtpunQOTblY9VwfBDeQS1cePVAic2DQkoVkMj8ENycckazqwgTuxXgii0u5Qk7oXmVjQSHl/3OCrSmv/cPCxvdfwoWIOgQE1Yks+pZiIqZagpN6CNeM7fOkC6x9AeCpjmo4cy5RKu0jTPxupYNhq2ZefvLnvw22wHRpL9Nvp/t1lM7SscXGwBpO46qi76rvW7X4kUuB7Wb1RrxkwPsrn4uWYy1/7GDjJgV2XUgQYaIVQ5Bz6W5uv0wsGILRaza0iAjYzxin9JsVxky7mHjDiUFLEWdkExTjCNAZWzGaDFMuBntqNbxcqwSggDcUa3VHPBt28rq3jNiM2C/PJ4=",
      SMTP_URL:
        "AgBK/Pc4L9ODWsZnBpeHi7BWYJth6BAr9L0V+HAdqlUO+/aYUAlh0IN2ITVLu+PUXY7pIWCVBXoWbuSSXeoeQQFV/dK1mLqT5AFwg0u//gUUcGGVaImZCzWLQsI0k6mZY7Z6E/jSkcQnPJdAHEVf5yKlaR2HwEfuMxHWb8BWhr8NUxmDu1rcAdmMkP3d7U6fnn9Sy7fX9jH/GCg20ecAcBxAMwmmGeK4z7CuD1a+ddIAYPogg3w6vdG1zRSxtx327eRzATClW37ktadYcSAImfnbAFk72X4bY/dswXYOr/NljXxSZ6rPD1zmVZ+QXLWJDoBV5RHB6AZ7RJBIgpXd9hpG19JNy7KQVn7oZsHr6cZgJ1hu2dU+OxdviDPWQb4nbeRGLOkr9mp9WOtZUb+fLb/BWwj5Aw4uRcuOg3xPeem1qS4eWY5e6RS8FV7YLxefEWoAhQpNLuEmQX8dzXVaPvS2Bos9CcBZTS2S1lYGGqZNg1A4tlpZ71hiTir7upmR5hMFQ8DRAH2THUD6Y6EYZj9zIusBHo+YgL3j1V1Hn1GRHh16Wot/cb903XsF0LpwkbHLJ3hqbGAn0clsUOlqE0Gs0RBcskb5JFAcoYk9YzA4kImbKT6yQl2ZRt+c7BJ0wM9TBClUortMh+wlMaeU15gsn3MbuM5Vgng6nNCo29oZQ2l6yERg3aC9m7ctEChKYs4R0/mDInBZmiBWdksenkt7",
    },
    template: {
      type: "Opaque",
      metadata: {
        ...metadataFromParams(params),
        name: `${params.name}-env-${process.env.CI_COMMIT_SHORT_SHA}`,
        creationTimestamp: null,
        annotations: {
          "sealedsecrets.bitnami.com/cluster-wide": "true",
        },
      },
    },
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
];

//

export default [secret, deployment, ingress, service, envConfigMap];
