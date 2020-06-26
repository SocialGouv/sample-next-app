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
    name: `azure-pg-admin-user`,
  },
  spec: {
    encryptedData: {
      DATABASE_URL:
        "AgCmgshRnxBC+bjqpGj1O9+rViDkYK2FzSyeABpzBdxs0i9hxeXTP8vrIm1GTAsAwb9mshYgaN/m+X5k/9nHDpJsT7S+DUFNajYBE02jlrQ/9FTQjXXwCD4qzK29c1IKLyfpcOWSfhSeoieJxglgeb0Wd5GJKtE+X34mqgaegFAXJIicGE37gldg0LP3PcH7KzgbG2Tn7RkbuBWr2bc2nktYrHfvoSURI4DOuWdzyJoOLb/28/Mb6TqVqk9EFBE8L1V2gf/HfRBulsw3OC5+n2VoXChyDlV+ed+61eOYXRsvnK1N7FEWH0QWirpP07b/k0ST5RgniKY79ZCnazfGfNL0hX2cmVUYazlttn8A8A0ZpZmUEFv7QvMhjywYPTfT5xe0YBXQDM/EVLTta3XIic3zDiGum+NfYYc4MKMpwjejcs7vmJonj5Ywr7PUqkcFqV8Dsn6pM2mje6slqyHTq/dVHMmyS4LTfEB8giE+zww1c7tb9JzxwgaTNBznS+yQc62NhmuLqB0Zp6cRa7XCfEn6ZJXZsDUPWJVQNp/MzddNUYFiCqwuFNS/RQ5ro5FEYIGn2oNa5pYdL1AxddUAGp7PQtKeDc7SUB8DZ6Xewgly1IEnjnH4ki1wUAYhRWSnTP/Oq9fZJamvwUQz0FSsVCpdw/MC2kPLs2LrIqP0qJJvnxzgPoVVxuCT+JyGmMO9QIN8sVJKAg8bhgSpLPG44gV+DJcatBRNvVP12IHaWEbjTJQrcqDtX7VctG9Nn5avaUeKSZKxsgqnnwvTpCoqwk73u1+FemfaNfmHYrzHI4Z4PFXgagvMsNRs092mTT8TbQnWEllFk9/dAJxT4bB4MJIyzpDBsOPFqIk+FP9stQWrRyUmrQ==",
      PGDATABASE:
        "AgDcWhfFb5GLaGbnUReQjmL9UvYhQCTpmAXQmj4ot40vHQJ14Bi4YrQXULlu3fXAYdEQK+LvtzW7hrrY+pDRdaOZGt8FXHfr4bjRACxoyWwFPZnfjT9vIZYYOkgAuzmC9xnbY54rwx9xjFMkQrbyXPzGDnk5vRapxOqUTLU1Hqw75iEFMmLphReepfYbFW58uOfwwOrHCwVxyHZ6jsSXYIRyYlFYkAytHtCJ5gtl8GLhPyyC7E/1LGdU4295gKg2x+yaJMN3i1/c3ag0TqM7UglMCq8fvuH4Obdv3idknwtvuPFLeUuFVRiZ5AhebK11q/tZ/RYN1ew7EAlTu1b4AIC5IJXDV3x4hc+H8QT2Tz6m5M3hotwonghMr7bd6ql+OoaclvyoygSCk8SZAda7TwiU8thU2PCoSvnNBcIE/zngXMxPC+83ijAjAu99MgGbjqM3z6gvOKJosA/r1IgDXC64394HAlKo1OkI/pt5e/RyRW9eUjHDdPcLJ+9klNS5IX9JTfv7vwvgRIb3cRfl634kpVkxrtj8mc9uG58Igz1yNj72sWkDoLca/HL34c/PRB8xEOMNsn/uEYW7TU0XWFj+9ykS7pae2zJDXLpag1jIPebShHDHXmLdJbL3cHVaBLBpm2tteuKq80KSyk42Nk1wGhJj4h8WLvROsWf2ezRHu62fT54jqHCfhMqNTZNM4FGPc1wLD1X/Dw==",
      PGHOST:
        "AgBwLT5PrA+i7Ffb/YIRohH3HTa3Te9QJYoRewBF70gMHr6pkwT+G2hgi6LpJKmZ5A057wasq36yw+nSaI4hugUvRRTHzec7IpnuaovXBlOLZVi/dcNJ4aQRFctCnMMLYkZ2h7sR5VCZ4dFwmRCYq7MF2YgsmEUfXZvN5HmZJ8B6hMCHswyTGlLIwf2yv3QLP/B6UGqp6WV30NbQvDIcwnP+q1EBek0w8p9aENeRvqwXai0sim4rFHxAMO4taECApFdrIyC7PdSjLA3RDph9zgrgVhdXqn4o1zuYUuMe1xZwZK6IcomNAzifqc55jiEmE5X98J/Gm0y0dn2Q7C3g83NIvFyPMHeh50pV0pdjLx58KOghfcRukRzptcOK/FIgTcOmcMZTL9yyFhf7Y5H+UWedaQBvqwpDvVUCREEuU8mxOQ32tkuOyB8dSgQA2Uu6x65925t/LieTMqeaVkalAm8lrBX1Io8vbXZhqGYvCNmj7oI9dOaMCPFZ1FFOfe5wEfdDnhI9/4kTfbGzICz6CKqQXmxbGnh5bquZ4bdqSnLaZl0wBZGDObkkWaGA5qwZoyIw/BlmyBI6ALM0cm8ag9tRd3iVmkGpy3zzqN8I91SIgNuJW8n/lec6IBEJBMqxVnbDScFV2205PM+yB8P7x/e63xekj4ob7meRpcmjYPtHdfQF/7Kw3uEAgnyXDymCjBIIKVV3J0mMGgTE/D2Kb0m+HjuaBB3/X99c/a0kMXIQ/qJoByQvxiAQ0CPLEBCqpRQikg==",
      PGPASSWORD:
        "AgCJ/2prVrPzmQ3RRXNtVwNti+PNIfWGzLOoFdhm51IUclHFDbly3fyv3wYWZbC+x1GfaCndyTm3TcufL3nsrASK51QWpRqn/W0V5Nb7pv3xnQ8hN7P8PnhmkNFGHMXotFQEhQm3syMOCHRf59JLIx95IIAJjL7js68KF2CpR6z4+rB4lCXmjlmIIws3j7SOfok++9PezXpsoyFxXXo6sfOvSuwK/0iRZXt+ZmZgnpju/IoQwWXZJ75zYatkv6Xy9MApTMxUHajjM6FRYSQOx79ARW9fOGGDS88w4IyuQqnS9VYuUjpYVU++Ql+7EAtpGfLjUj7p+ClGI2nZ8bKk4kACF6yt4YhGbwD0VbXrBWfbh4cWJ11N7hHj2Q4G2gGYQO2cuLkLipy+/fWdAUiWDApEYtyGUaUIU3U3RC90pEDbEl4GXNh2WFicA6eFf+RaIDEi1qoTBidjXvGvzYQNKy1WT/hnt7Cl3sVKk22YBpd2lOWRiPlsy+cPn0KE27oSQAqiWx5B351WsY3NG4c78++Bx8DFnkMcWjlrCX/CQfKEQuZJz1UgajjMHE7qmq2xo87C/Fdjfzi5w2R1SUeF8rOt4kPaPw1Kijse3N9fUJNLpV5Xa9lThGwg8vO+LJOyKlJGNNOi5EzBc3R86gPZ6WI7twbw0ptRBcNRk4rKkjgAz9OVmk9nKoug6pdTKTDMkSZ5YbPwTHo7eS+xgzQjdJIgcbEDYBQFrHWpko6e53ZUt7V32hIDVftr",
      PGSSLMODE:
        "AgDQ+2n4ypNiCtpt4JR2EoACYFu9wOFoWO8O20KrhaXc483anRdyUe1OgO6p+rID2opeWh/80IFctlacPedPRbLVSI0883iDJ+RGJk+31JrsZTY8fC+/HGatbzfGjcSXS6VJZcQmP8jcozp7qmaQ+yvgp+CeCoXNO7OiDXh34iYxXQIkCznqimsRGxitmyAl7mV1KRBRiViwRI39fXLmzVF2Fgb6kPYOtxcsGCP/3Z0yLgHUdFyAoZWc1SLDwMCDIm4JszlDf+/BbDEFmcXIrrCf2Tm7zPgZON+RIN3ed8QCXpvxQQLTY+udba2GWMvBsKMoBESPewYUGNG+ILbLXtWCi8mfshwZRvK5UhUuz1068GgHtRTHecmxmVIKLQovWGSn3yQGsKc62UtlP7Yp9zVD+aQrFQSloUI+7JJtmE0E4wCiKCH4MYTzw/DuNWJVMVj+f6STain7wexC8239++uEEf39Bsh8bboXGAg1Yh/zBOoq5MLDvirqBQBtmnA5xr9gAtsufMq8gCU8Iqnlo0timIJfrz9+kiz9e86m0TzvqGPPqhe+eIpTVk0KKomZ56G7K998AmJBuyvDJxNTmt9D6moLVmbvZM/NDLSE32Ai1CMSBdlpLmigR8aZyp0SsZHHcs4CzlYMILuYWqecvX/elqze0C/g5srpLyUlpNXg/ZtV0jxCbTlfLj8stmVTCZ1v9k5Kae4L",
      PGUSER:
        "AgCoQgZYVwO1hhGcfEB4ObPV86jAORMNcDR/UhbKyzNjNlTaNyqMWkyPulEpQetnesSwUjO+Omv5NjRRaL8PrJGjGJoWVvNIlL3/AoSKQIA03FR2yz44/PL6EQLiwWr4Dv0pl8mFg2K6tMtSp95jF9bhmpkkP96OPhAYbdT3HDQAaVQ6NBnd5Ed/jI8CddW8012Cuqunm3yINpq55QT0pO3jW6sGYXxI7QykTWjFKlX2zNCEXsEtstKvGtEth0f5diPJpbtbkvqd/+5IDDGQlrL2hz/OYMcGpj5rxEAb/BHddp5ckIwH9pVBbPMx7/dtdr0MOa/NMEqNklRrC9iCQOnceBXDF9JLGCEvKECN1Z2ei2FMRdD1TlWc9GNAmSQhYICfthZDZErGD+zeOSZQ/yLmxuyNIgIyYtQjkxpTrA1QdxbZ9bJIv7mrp4fmtHW6mqm/ZJCjEoEil7LL+ZoBd5lz6iXv1MNGjE1empYLZ/d0bs6VyxktVRWhFp4pf+v9Oqvpa6gRjNpWlpSrcttdTmmDb0/wtYvwdWzPnYT59wH/+h6Inrx8k09OL7vz/DxTzABq9aw5VQTq9X6NbC+6nwA22pxYAc8u4bOapVwcjFeDnfOI0yE/Fb6XRPfKjiCn4GijL5ULaINs5+jD5z/zKgJhTiXcR+OmNgNWOKYgrrPtG47tQJ//141tW6LqtF59HYZegIj3ohEvGEvh4y2uHrWTeDUYJUXmuSlDtH1ycbUlP0MjpT5o89TYzQ==",
    },
    template: {
      type: "Opaque",
      metadata: {
        ...metadataFromParams(params),
        name: `azure-pg-admin-user`,
      },
    },
  },
});

// todo: only when process.env.ENABLE_AZURE_POSTGRES
export default [secret, job];
