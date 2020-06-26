import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { Job } from "kubernetes-models/batch/v1/Job";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("create-db");

// image: registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db

const job = new Job({
  metadata: {
    ...metadataFromParams(params),
    name: params.jobName,
  },
  spec: {
    backoffLimit: 0,
    template: {
      metadata: {
        ...metadataFromParams(params),
      },
      spec: {
        restartPolicy: "Never",
        containers: [
          {
            name: "create-db-user",
            image:
              "registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:0.28.0",
            imagePullPolicy: "IfNotPresent",
            command: ["create-db-user"],
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
            envFrom: [
              {
                secretRef: {
                  name: "azure-pg-admin-user",
                },
              },
            ],
            env: [
              {
                name: "NEW_DB_NAME",
                value: params.dbName,
              },
              {
                name: "NEW_PASSWORD",
                value: params.dbPassword,
              },
              {
                name: "NEW_USER",
                value: params.dbUser,
              },
            ],
          },
        ],
      },
    },
  },
});

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
    name: `azure-pg-admin-user`,
  },
  spec: {
    encryptedData: {
      DATABASE_URL:
        "AgCCvJ02qmJMFwK8UXf2/p808UxJYsM0skJ1vE/K3oZx/kYExAbGeH+ev2NXmclB4WkdVUe5+Y12dZ9xPDXgGsps6e+g6UndXcjL2u80KDA9VdUf4nMeqkgjF7T1Fmo8pek/eVfbDiuJVYNY3jxUt+UK9C+qrpYPCbh8J8dR38aSjopSs/Z7xO1/ofM9foL/X+U7Nj98VEnFApXswyBbT3hxWeKMnMH2WsBCjdi0obZNJSrmdoQu1d5hFeg83kDhog4Z3HQXpzaTApgeff7vNQWFgJgvuYn5WhT9TtMX1Os3LAeChWZ48yyMkGnN+HT2xnIQ3sz4nlYtr5d59SPg3Af1sJnOg5N0uf6dAly4t3lahgG8E0vOYSKz/fWHGw5d5xNZP5T0HXn52RNv5P4tVjhbvG3wh3nO0mvfcntfkrejFhsmuIvOsICOd6hf+F0GkY/wdsACK5nMxgdqGz0WU5Ch+cZ9/U+KmaIATc6F0q1+1Ny8IV7ACKSAreJqWP0Wlp79WudvNBIHHxGXFVNceroIBTtF/3jiACfPuUuBrrsvHf9cdj49rVLzq/z+YcyKLhkPYKLtntTSqepAMi6kIW7/HVd1fPBuE+we9gQYrbES8LcFIdPbEI9C73Cvad6DeXtOmghG/YQNVJOGQwY8Y26bGmas2jQluP897HHOIamEdISDgGEXoBqsE2ok0gQpt6ZJYWMSto7x3fCxqtwIW+lK7nSim+kPG9brxcEEAXDghoKg8Ts7GX/aGWNcddz4/V4sp6Cq7HeyJyTd4zFG9ABDiIvKjdI4oBwc0D3cVIk+u3Bip6TzuJcjs8YPWZDn69ZNtDqD2b5XCrt2SjVijx3+jiwSCb4SREwkGxzW5lhzd22ekw==",
      PGDATABASE:
        "AgCn6LWNhsJ7MXU6Y8vN+v3gGTAqmFGDZ/cGqotx47K1+sKlEVkWqTs3fXqRKDLCTBRCnUdFPNdnfSLRQ+NFZW4gTMGOiJuYrhOF1GCx+P7+B8KHBJqMerLXPfp/EgkFGwSBuoEPEVI/rShJijt2y8YwOi6p1f/C/4q3/Seast/G9WyzX7U16hAUHFgXhOumtJhjkBWqj2AwjTskm4xmHH1DUvbCUOoaEFE4gqEFc3bY24WGK2zHfpJtfaJ0vvs6xNYl4jOOf85ALXAT8+DnBEPAv33Mm/jhm0QVDLuE/BgOxZaLRM84TMdl4SZdujTv+tCWaqZ3+4uu2omv2EO5xjxmURWom8DOucWvzUbJOBPuQY5b9voMM2C3AIdZJm+sFGJKoVjh2aYsvVH5FHTTDnVK5oAgJEtSU6PSLtGVHi7w4idGCq6YeBtipWlBJK/fyts5+Maxd1ozGM4bw9K+SSOUntfHFWeffDxDvX85Y3XX0GgZ9vqNaMoMwN0S0a7XI66FxzEH4udMLewxy3akfAnkGaiY532scVCe5WpMDgBe9B8XhKG2LY8wi6TvW1aXY+RD313v9pw1wHLCAaMCTPW94ghLQOvw/Y3MyxqB8IwK/HuEs2fX0s82ADppdybcsbmSHIkrWls4LpWCMjbaZ6oJTzED/OC11RuNDRtIPef/o+1WUj2IeAasLVd9y6q+zr0yeAMnGePeUw==",
      PGHOST:
        "AgBCEnnUF58qZOdKWZXKb3b1OSJAfLLHfqVEd2nWHpK1ln00bg6/4H0tM6bwu50uBjelRlMCUtQHmowb0r95lEoXcwRgv6GSYmOoEmmIjYsKBgiBSaXG/TJ37atZKYFBnJZhp7EfaW+HPW6CcvAJupkruA7dbWX8CmEqFn93Rxr4gRAko1UyMhmV/N9q1T6382Bp9P7kz9UiXyF16zo991uQnndMAO7fxo0z70U7BkypGn8F0Of0cGyJDNAkae1aNEMX8TkXbZ6nzFIYZb59IphROyvVsRMal3dFIepgzuF/WArZvZk5G+CFdA976pWBqKYry1zn2jw6tbkesPlmo1HcQXpshtY+TovKnmN1uOrjV/7vHI+KN8Qc7F+563DW3HTZbC3WCP5pbpAKlVncFDJP+9UstSwrx3LIFjdugRFHNDW/sKh4y5Km48fHvN8hBclTYZ5dksAp3Xat0d71m2b+vGgbBQ+icl/h/WKUJwOK0arRuLBWNND3W8N8K21KiGk7HhQ3Z/3VG1Ni8lyhuPGU0uUuGB0ma0BrB/MHXfg4It4uxzm0EjClI7PnQQWMFNOGZ5uZa4Y3mDkxUJmVYAHlHl9GTPWV5BZPIpJzDY4o5ZuRxgTsAaaW0FIC/bYZl+JPlaN8PNjyR77ULukUiXxEegrrn1OjtJiV7MdCKDraGQxhtVA/4oves3HJyVX+w88jUA2/s9jANJ2JRA5qzLGjBfqja8FxL9q0Gjax4MYc7xcfgA9pjLItf/GbSah+7nxLGg==",
      PGPASSWORD:
        "AgCJndEsM3A1eBKVwsbFx9sVGcMxNTjfl3QjJifZU50C/yBEBgmZKP6NfrTkleQlDGnLEaviVp0E44IB3cOtbm3tjY0NvVbFXSx4t5eCCeCFAgxQwDkNcBHYAYkVF6tElS+888vX0tC9RvPG0YhCVLd1myl97kbxQ0mHzlSHaTlsJ4OAhGAPbj2EaCQmzJpHtnz0jqCG1P0FGrLhTNvTLHGglSutbFIRTPkudBtftIG+xc1AsiXy6eBDgq6oCmsUfCUbPt2UDzcj3H/QefnmHHS64ySxd6YAicSkREBOYwLTy3PFh/zE7vVCYHzwx7YDi+eqXpToA9uzNoLur0+87QzykW4i4VhzOEU2i89/wutd4XitV+CMqGfTWI+OLy+bKi4VfvFQyDkv3b1pUKpXCuoVBRlYzFTwpNASFCjJv22xpjQYXNwLDA326m+v74fT3qTTUqHajCPUsJdDnC+1C5YkbN0+yBCI6P11Br9jX4BrOKPhqiLIYpmEibmtDcCAUY3KFQPjbC6mHEHeIdlfPKa7oBHP2di9PE7GixJify/Lv2Y/EKIP40hg+4MLl2JGDtkzBTHbA9qyFY8DVkmEbEpKJG+MIqL6GZyoYFviyCD9E8zOrAwQ4GK8hIwjG3VIm9l2TZLJvsqnc3FlD/NOga+d8qEymIc6TdT2L3aAb5yfcfZbTJGo0vST83QOWNhMDXKos9qSBMZLXy6xhGYU0SEEuOaGX5QkxX4XkyTtVbYLkzZ+CXAckioz",
      PGSSLMODE:
        "AgAeLfn5zZHhZTAcuLYf5ofTfoDybqoE2u5GCwAcK0BgPGOTe6QTCPAPX6nN+Wn4KJn/YyljYH0jm335Id/uvKy5zL+2Z/PMHHnOyIvKlfArqev43G0GUi5Hkb3W+i/GYgn8kVxt4FoK6Qcg0N4ptSdvn2stv/VAy48GASdYBLoY9UY5t/zbfYZl6si1Bar04FN8X8HXLdMRg6GpwAqEu4X5FJwPS7Cmw2Gm7Mjlm43nykYWTA8D3cw53mTMvrpWKmUuhJOgSBaaNY4gF+3sxFoJOp0HjLhwVPgjkf2H97hKSodNRuOJz73FInp2N/otgw2W5jPZg+VmaIa7AuWDCW4f3ZUEXykM5d6tUV4r8Ib1mzux9aHFgsL49j5pD2Y3S10LQRi9t2/APXSNirRkj1JVFyKA09FJEzVsQyuuKfcHvLSrja6RurgTWWSJ31QJQvLY5bDwxRIvd33pH3HY8Fb6WslXLnC2WubMhYzN/7/2D9OJJ2jO7FUCZ3zKV8YON9N9N20v5kSuW0rkxw+gsR6AWVq1ujJ6rr4fc5CqicXbB9gSvaBJZXVHoxiJxcMFcrIG3kzglEt/sgNqPtHEG+x4BWjhwJ73smsstAu9dI3YM6PnfO8rfbgrnVM32vmC7xV7dO2UbkyiAr4MDn1upNRZK7i4SHOetb6gPFVErJGYCACPYNUKMMJLBG3kBrJUwJh0hOERwRPy",
      PGUSER:
        "AgB9wYwqOpJpIcOW0mRoXuqAlhlFyv4Sj6dd4H3wy0qxOFocTLtWAuBAV7PIkTGGv48yY3GX+pBjw81sGY2Mv5YJiITf+EUYmt5RxE/jYDt+L+2PTiEj0ODumzKBuCY6dtYq6VZQ4phf1fu5oXqbknK2F1CjXBInvH/EtDRIMzK0v6AU2DyxoXf8Bw7SWxHMV5Vm4jMEdlUrdXbSAtRr8ELvORePXpDd4SPVJGqpTzMGQvvWGVM2siHFkiuI+nFAW6enql/byTCW6cYeF1hs8qF5UlrVNNgyxmCeg44P5dzHxpS+cQVmSYLJmmYbePKmkgTHlaUK2u6XFeqoYZMokXqyKw8amonohLHsiDBQ5xsk0ZLhB02uv4RWX9CfGrUF4KdhUAwnmVdzhaWigP/sO4Ix6iX2Tt0nP6170MbciGHCpwJHrsjxnfXreRdTyhGr7iCBsawtCgpEfoqzLr8xLd4U7AsoaN3ujhLQ1+Eg2fD9ujyT+vDcpX+lWWI1laPnpd9TcUrCuzVpLNgU8GVyp1jfS664L9WMT0GSKFffhb3M7DXxx5Vq5ZEjh7U29R6nojojtzDKeDEX2EsTvgB9KAb/yAhXuR84wsrM/an1tFC6kzpDyNDmu1vHqRmV57uUqEq1rw5dJVqggcun8f9TW55GNHjwhGWkc672N4XQU0hM9jQ/Ji1t6s3v8v24pO/zI19b7/fhcYE+BWpREWJEIOfIfx25FtHa+5H+xmIKK2UVqOS2vZ2iCt36Pw==",
    },
    template: {
      type: "Opaque",
      metadata: {
        annotations: {
          "sealedsecrets.bitnami.com/cluster-wide": "true",
        },
        ...metadataFromParams(params),
        name: `azure-pg-admin-user`,
      },
    },
  },
});

// todo: only when process.env.ENABLE_AZURE_POSTGRES
export default [secret, job];
