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
                  name: `azure-pg-admin-user-${process.env.CI_COMMIT_SHORT_SHA}`,
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
    name: `azure-pg-admin-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
  spec: {
    encryptedData: {
      DATABASE_URL:
        "AgAG3SvDWchEgYLNTsRufT6cMfhRuJCi3J01k74eUNkAbICGmN0zdxOBjS2hT8Me5HOb2np9+layH4QJRw/TAYzrj0qmUeXoRRCfzzxcpIWCs37nF12Y3hCqBHIwIp4Qb/s9jk2gjkYOZWGfpHwaplDkOGwPGHvXJhI626hf5yIZIq7rCVhcG8MiL+xEBRW/k/9nJ+QKh70EEK31JSNyRs5eSadg3+LIKJKjYNJmzX3h61I6Bdc727evA4iM8YNPbJ2XpFNZ4e3kDv85se8DdjCMjtKvXHg5Cb/trYto3iBH9BkhajOTomQlcFSk1tqA2hD3WVI5PaLqMC4PlbLAy+THLNTHUQvkjTuxnDXbW4ZKbizYvHQjq14h3S8RpmOxO1UZAzdPyhxJRVNPche4hdMmMnsy0Vwt0aH7CjhBp/LBRgWhAGAuJyr6jcM406HnXoroCiblh0PHSJa4PuiS5TZRCZt1XKbOgB0L4TCCIPrsnU3up5ja07N5rAGcMExHcR8TV4kU+6s1AOEB/1O1MqvMAXcHQnigYYCDwLMu73OMsEmRAATUtUOoaUJe1T0dT7tkM048+MzRg89Z6WJ9uwA0UDZWFbsjzSw3YTvmeLep8A01U1xNWMfM489qnN4nQ8mrSVSBmyvaSA3evE5OXs6Nnuk2QLQzD8ncYHmh0mwl6o56yPAlMIVBSmOHn5DVFFTwK644LtFJofd/LsYpRCOGhKuFF0dPizyOwSav9aTfYOD36sQjvPya1Yn4PLfECUsbFs2nekpJz9j3r9Q/6AskGKrTC2UwIWHCT7LZ56D967BgF+QvYOAlkKAeesE/0Djvm3IPfEZXCPswjWhQ0YH3sKB8laFmWSKfGcGxjRkluSYjjg==",
      PGDATABASE:
        "AgCYuZ32FAlfM/4PzwYo82TCMa/zjqoS+OYThLKJbhAABpeRnDeWto+8E1jYhJYSnwIKTw32Zm6WGe2XFi2nfKhxOZi0+lzSzyLzGK4Z/fus1PhgBmvdKOeE/Y167GspE+PNS0Ju+JL6CPIBEX16mbfEycbFJxowXbJcxGJJ1LhYNvqNVnS2SnP9URe5QPki1PHN2blcSBxrPTfY0efufm+0s5MbTVcHwh9eXBrBBV0jO2y6GW5PfWLgl6vv1RpVsUJgNEcxPWKGt430t4Wof0PaMhBQQeXk4FOXET9QBsgFVbaQCOXqtGB1HSc+q+ZGbE7OFjP5q9Q0QifcLTg7lzzkrqH542joTgNjWc6pMgJismNbBLFGRULumdaPs3c7dWeFklicmFARPII2JhigHKuh5C5JEEYdtaeX0FPjy+WKstjHjZrKHTGgojI0Y/SDRyEK8UeZBZotqWsqvwdB6RX/8Wb+3mwzQrNWoOqDMbgi32wALyt/nvWu6epvg1GSfTSQ5YpHS0QNnOab5z93M6JqFxjhjnkDxBQC/bjoYbU8VRanSve8x5WAZ0FAh/4JJKgedwmZ1oTh7r4Hvzmq/31IGG009yAnR6Pu64hP2YJl+9lTOZS2RuHkW84tVP7jGTQOxmzh3ewtFgkzAOGefvKkmmOEXugjw40q2VNd92P2bkgAZs0BoVbQOzkQZmrEJh3+3dWwuS0yIw==",
      PGHOST:
        "AgAkPATmbfX0+lrLdbSccDKSz5kYwJjinCmowPNMuYTSIHtuxqt3migh0rwFOwt7GF4Mc7lif18JR6v1upXAEzsSQ2YIT37LqHgbBxzkQvoOmLNVPHeMV0hujWXsxncMtoIOwm8J3hgAQVqn7ah6T+axz3WeKGHIp7GOQOy7ZJsPQtpeIm/I58ULffvGxuo5MTybo9lQ1x74ULJ0b7q3z5/cRsdf08WncJX67JLl5yBypFhee86BdE4aBvV2ORy4nLY/2sCt/ZFhg+5zEJaoHdVlGxZRF4zTsiYj7nEGWuw7fSFTVcvAiBC30jrLRCj7hMWq+mxeyHsjvI/O+6nfEiDIfAdoBFRTBLTnVJZaUZkfrvnvOmTEEX47fkSmSkNv00ti4Z6uwrgBGUj7axODeLZuzQATs0LXwNou+OsoUkv+gLxlLkbr+uGLr2XAWI0vQJpyMGnt/H00OI8C/A+Hw5YQJM9nNKIljXmqJDzcuh0snmXrY/u/9g1Gv2u14fOExZCm80dhAeiGp94QaWYC7hYaOXeE0lCIDnQI2T7DE4LRopqq0oYkrQdyM4xe7MNCWu+quvzY57rZUO3VL+aZHNhLvARmri+7P9T5st5J8CwOBxmyBxSCB/ltJIBOfkvl3sZcvBLp1XI+366t7RlYdktTvCr8WbzsU2GdLcmHU0Yf4SySziJFaar58aW1+7lbYMsfoq4v5CuWWNjPVphIu2zncrDHTM6T4HBb2ki/aBg04ZR6FFHKehwNvyNJBfBy6rERtQ==",
      PGPASSWORD:
        "AgC6F1Vg9nr6E7X1w/Tlvnlx8YKOcpVQicdPQhbOhojYyKF9YUMF+OhMcobu5MzaRqDbu+TGIn/cQGwbs90Wk+lGbQ5MRudEVyZMVVcZz1PijmAkbh4JkmLYBvMqAk6J0foHmcZG/3bzojzbOAQZy8Xc5kIFTQlcLCf5i7ELaUXubnJXngtnTxPxv23otVRTSYd2oAuO7EDbPJxyMlwCtMeUbnrbiBcpGCfCcbLiyWM7uikmsy6645DzEjQJ0D8q8bh2M+Ooz4a43G7VSxXDygoKr0MoRhrTTmpOXK7UJwt2e6ZRZj6sWmbNVFgBwQopn4csIzM+qPtF6c3WuEd2ffDDMgubA8ma6UCRZCYyrg7wEFxx1yd+HXf7VNg6kItmWGqrzfy66gPQlNqen0pNFLlVMWe1jLi0Un0nayRTRCI+AcGctZjY1s9QTkxOXXYUsBNUbYf/zKgr7kiJc5ZIR26UuiMj/yuXWBmHDgzhuNQQWWiHpsoUCj3Y6ZUN9wt3cNi2rXAWS3YGhidd6pyjaJx25weNqxbAICksyGI5nnZ+JUgOvpqFioEv/1cL/m+NTlp33nUWk3SvhMLJPu2if8rIo059gRWtU+QNtu0u2vLOdg3mEWrbzuuDCG7tVoO6YJBq3p2molf1+x7P7qNf0uIG4mnfFXJEUlHELqwswEY7ZFC83AfAtFvG2IIeaoWIdfhd4SZyxSaxZ+np15FUIRwnS6jI/jseNScxj0W22E2Y7pWz6UMApBe0",
      PGSSLMODE:
        "AgCuL/IR2M2KOkLGSjLtu1mXk7K6z4Vl+fsnko+9n/7o61fBZrtJSiXiL2APg0jCL9SfALrTNQUWiqgMtpCc76hoKKD5AgWwMydYaR+pw5CFql3qKJQJ0xGJ4X34C31suJYkWQq2nof53JYssGMDq8TyvG6+vkXAPkdl2/98taTvbyz/vNKU5gRPdizyfSV9Xonntw3KyaQ3yqj+/dD8LEUm4w/TCVhYb2jVrPIinoJiIrxtIs99d/dJIHB+nDSXkF3paPNJ2OSEvMTfLXUYM/ZNHAq+kPh1vyDKMrtfxxM1Rq0SgbuPXNfZOuLtdch2VUewZGqYqpBUtKoSNOUFwLs2qwdK62tvFyGnJP2dWmekO2KGyKe9mHvyMGIHW/W1hxTiYOK5xW0qvobgEWCmgAloj3k3xDqQ0eD7qc2OlUQtvqBFzQETjwaV59wNJsqOUHQI9gQBsfeCE3o7UbghpPSAQvCFwMOUQxuWOdm8gc6d3F0dTsIIiJ/xydnqMxdfMyogno4g9Q8VEUkUux9Ui4vAp5Z9psucYYMNc8sgDxA09BVtZgtKpm8RFf3QO0tcSaHjz5+cb5iuLxQ2EnU4HLJ1gZ+MpFOvcxUV4apSKsX2Y7VJZcbePB+FQiZT6u4Dsx1HyuYnA2nYku93XkDdlXrxsCL7ThkDgtlfNz1JFm1LX1g5i+nlu+/HfkbtdtKMAI7yqhrZsbcO",
      PGUSER:
        "AgBtaw5O4rJRlik4q2qU+OfvMBgQH6X7MfDS8OdqhoZSwT0diM4o0bW8vmwhhYYsd7BBOUFnDDSFiiqNn7/TgwP+KJEjZEel8Aea+zn3C5v7bJ0oTiJozQzjcURXnhPjQfR9O/LRoBqHvisxMNYf2fxbxR/oKrhvLUd6YihFwdOlqPql4o86fh/BIjA9XRXLX8YwG3eQq4G2396HcaI4Ufm1s0IuGUFsZYWUY56CKFH4UQDsnI+bH+WvBRDkhifQXvWFTz2iyb2cwi6oUmnzGWNG93vxAv88auLpj4/5gkcjCLHUNgzKfk+A8cYszU9wZLo4Lmdz9sHks20slxTmQwf/S8TCfFpaoDO4MJKFnG+h8KnPIf0PazHVguJp3frYuXc0rvk4pyBlekUIkPKWTzh3p81iQCYbhHXTKaSdX7ksBC/gVvu/0Z9s5KjSSnqWkkLpTtIdygiTt99+FGnjmYHBRcDOm1mhH0s6wscv9pMprQzZQvLx1+JMT7ibYwdE+xG5bTrDoOiYV675tIqVGorniU/Lj/BjlcB0ByLCvEjLfWZm6bKs0EtPfJXC7m4ISUW4XeY86qJyR/FiIcx0ymbiK9UIGqEG64Nw+6qml6qDIHag2vJZdqPiUN32j7m246255Y76ZqdUl5gWVrXcrRudgbS09yDQ83LsZGL6d4tN9aYXfGY93zyHfS3lh3Z5bY+/ENKPstLiFH3mIsfiDTl3ATLvi+CoKnkz4IAOfkGK89Kz2HokXYe5ug==",
    },
    // template: {
    //   type: "Opaque",
    //   metadata: {
    //     ...metadataFromParams(params),
    //     name: `azure-pg-admin-user-${process.env.CI_COMMIT_SHORT_SHA}`,
    //     annotations: {
    //       "sealedsecrets.bitnami.com/cluster-wide": "true",
    //     },
    //   },
    // },
  },
});

const defaultExport = [];

if (process.env.ENABLE_AZURE_POSTGRES) {
  defaultExport.push(secret);
  defaultExport.push(job);
}
export default defaultExport;
