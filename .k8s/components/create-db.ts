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
        "AgCm1+RHWF5PMRlfeoCH8I7uULAa916N//uJL1e0XZg+olFHPWFWg3yYYT33n3GuZ3cQQfHH2mZtsiovB2ySnwgxMzWXgt3UCxSS4GG80RPmVSzg5sK7cyB9MJmwYvjS5LtQOlrqjUAtWUl6ATnQr2RlFSoF3MhJBbHKtfUNjcv39YI62qwNJCvflcpX4m4ZSx3o9UA7im4SckSMdruWSEk0PqZaPzZuAnIp7A+0/xiacxOWjasnHlX0+s8SN/aofRFC5bzigPkIxXpfLA9Lw/9YtmgYfZm2NNKNo6YpJ2bEgw6nvjY/ZgFx+iKyzVRUpxKNUAOf0TOy4A8OzGSnxEhfzKqDtqTYsJk+iOTUrGuWDJ/OvmdIYgdd1WRQtkQCnp984DDII2cAXiL92A69yyuotr7MeJI7T5b4AnaUeB9LNxVObe+M1O9P9U9OcOXLeGbc+7Q6L20H33NJZKkH+mmeWXbvfjFFGkGlUu0lKv0cF62iubPEHf9aP3BbOF513rzJPhKkTfT2w8XksRVfvrxai68IN6zzIZSpHUgaXqhBiy+zn9bH6SEBbop1l70/UoNZB+dlbjyd93Js+AzxkoqlbrbNhYlpr80V4D8Lo42ZgHp0X8yqrIurQpcuhhUYM7eb0ySnyvxWVuQZzF0c/TEWrG/v8MTiF4Ap8baFx5Wmp6rNj4HEn6bg0SzOfV0ZtTrpgcGCZkISzVPdorsLh8t93X8nddFXQ6zbeTkHTwzTyjcUYO6vrYt4vedNHrdKPsdiK+PvWGjhjG4f53mXToH8M56Nx3fd8X0u4yrhvS12ZQmh+h79Ov2ZJARwig9g8y51dFrtGHdy9qLCSkIdFeSln9ZVS0QhAN5vPUp55xYVcEWr4g==",
      PGDATABASE:
        "AgALxYudhP+nDo66WH16DGmAB8kizmWf5NWHpH6FozLe3ZCxo8ldwZYbqDvcIlDYFeCsQRjjf6jGenl60iIz5jlqWDL/vK50c7jxwhcTiak7wFO2DrgksGb2kBn+cyFBStVpFDiL7agOhBo2992TzC65q26zM/2ZDNTfYi4nS3PrTadKLU3g+QWSB2CEDk2iWHmioMAi7aWqdGATGaS+nVxUNJfR2/TqiGeqEitdiKlnqTkRKssRfBqsawXql6QgQMssiL/l1jFp+gJoDVhg5reBueDrNbtMoJe32fe4Xcn/AtGq3W2nD/ydrqYT29CQlMnJ2XZv4neh8sXdp7SyfYR3shADJXMx4KzZ6GW9oAiJXewsMFIWZHtMY/5iVj9cl3L01mpsoCgMySRTCuPO5E5p5sOQFjFgi8S1chGyyHETNuxC/ZZoB0iSseoERn6ywkIy9jPSc5wMd8O/GhA3sLy3PVdgfU1Q5hdrcY+cHZ0bSv83ELjk80JuAdQWH0hplFgTRqMcHq+lD/BONJNfRkD0gkF/k/r33gX3ddiDV96loYz9p0tNHljBWYWKP5wKR08zHAolmfueKLjfnT7J4vWiBiJN7JrY4E3LuFY0ISpJI9tEgaEdGTEmYmYEe+4OzOxYQEpZoEpsmoYThNMrB1lCyxpDmWH9HJNe26x8jIMPUXvz3CL4C/eKaH5Ia4BCf3jyzq1tjeQZnw==",
      PGHOST:
        "AgAwiktxGLYdulKRbnvqUlX4vC8DcyGCTjDgAkWsmBDC9WHwoQodVtaUDv0adx5Wdd1RFulr1kuLov5SfKdY9A3PfFuJm6Bg56RAfV2ODodMTusaGbQ8unsikhpjotMrRuhf4nmKSymNaOh2YZZXxrkIFoODBy5O5dHJsynsFXGsgcIB3hELxXGLtApUEut2G9qfh1V2wOdl1mS1RHblUUqzVsrRT4HvxVTJd46yGPKlmDm3XLoR6FMNZdXYIZac/2djk+QiU68gpFWH/ricGBKMC2NFJQjUtXbQoAIViTp/Sa0841Omki8x6O6Lm8l2zM5RZtLzNgs+aZGKe9fsKMGwd+3etWHl1RuZCfyIsn7dgQCUCDGojfjLqRMWbOZy3yJAywJ6AEi04Q/kYQuf3ROSE2EB63Rle60wK0iC+CMfsO8kqFhaWbJC1ZJ2rDrasLNBb3T+SCsONA7fB+bFv+VqAq7CS4bdSRJ9xUaW9wp3Ig485uSvFwfEgNWuBH2IvxqazrYsnQ/5NctnIq25wRggN1/LhVlD8xDENK0FLPvEE2hhitcqXij8j0OmoM4fufVzrPeRRXK7MNH1z+Xd+wSg9yz7V7VLsdeoi3zLYUa0ccrAxjTYBii5y+StAwaKiplkH72Ue4FQbzMDlVCugC3yk13JFDMNK9o6akNFA9+plqKZRD5G7g6wnQLBpPBeVAR3Wp1Sa7pO9PgMb2PyrnZdmBDuXbt1KLFynjAEg9cBzRIxUr36A02iKJEDzbr2iDNB0Q==",
      PGPASSWORD:
        "AgCsIGc7P4Py8pKcQH8JBpBFGImKToQBtJHeYKfR2oZTAySX5DSJ2cdZEWlFXWImx8mJoMv2mrJSTsj2q8gAdESIggxGQ4Z40yYt4C9QftgSqasB4UMzPXv/1b9ON8Qs5kaaEL63SCdCLeQQSEiVxGLP08PHnuyuD5mZSqxCE/if4X4aN6TtB28I1rejBJN5KqHkHTr42wHkDFG3zPm51Roa6e33CmwAH98LnvrLorX5pYy2JXBx0Tb7kIT5sPLe6RRVfhf4Re6YxfqINX3z4uK55B/nyqjDMId0YqsCt9tndfNVyfredrhyAyxKWirA5mFttjV+ggUfzakBwy8unsVx3v3p4rxLj8scGqDYhRhntORgaaYFI27aKOANUlrK/cNfL15hrAl8tSc701fCqQV5bZZ+nBkOSoKvIIW3JehWzJbCwJzU5623osRl+Cfr9gPXXi8So0gv1OK7wcXPznf+wbzwH2/uaeRSOnJy0PZxJU0Z3Grf9E0cXC0H0ZHCPwQAuchRHfDQY3eCnoJZfXGa6zZ6jCDhDJfDU+ac/aXeCvb3CbKc8arqhHBPcC5sVOSZymwdfzq8OFa08v9Xz03fgGEFiJF7zGgEbya3P91NHxTAwemUm1ax9V4jbvbkOsN4l3E5KJGPggBqZGINWT+poZ1pyEMjOyB+46EbFHnmbL1brUNQ0KEMOtfvEqm292FmgW+7kkqygsBu+vngTC6ckcJKKiP9TF/LdizIxAzoSyH2LX2p2ETI",
      PGSSLMODE:
        "AgCVlJgkZydJpLaNijpBQLEwpdd6zdld6PZMsUN7yTpNx+sCdBsnmxbyNvxj+hMp7mCWqqksBRMQq3n6bOQfr5hJyYDyI9NNYiWzVXLUUnQNc7BcIXH7lrQg/9urgq3o4l85cfL5MfXQ1cbxOtEmppeGdH9ifl3NZUTzgnqQrOXnLOXeZxxueNIORqKkGxOexwjdpFOBhoDjZ6mYyczMhDgOxB+piXsUpJvd3d9MaMFT7U7rCmQuKD3nDP+B6OUDxhzt2j6N+q1i8fuZ1QD0tPHdRXEJBcnCx8/HY6mtVVObhrO5pQaDotZnDMp95o8eyjR3BRpQ7Q2i2hxgp+z8Uq7UZeiuYZkeoqz+rqx+xmWzuSVcKTuvyhsE/pnk4x+JUq67mr4PjjZpF06xgq9Sc7zGQ25irCKXTlM8UBKdKe/F7MeELnFpsB4QsSStLlsdsmEHTD3xNWwKQkqxlTEDVJis4d1Z/uwS/+DBcWtCwuD74iRs/dsvI/MOUZ676JxBNvoa8c5LsB3K4Z7yxGStmCKjJXQsndzcD8vhTHaUuW9dKpm1tN+7RyIy+snKYe1tDBjAymTOYRBXxe/9rfjaqHAoQEf6tE00aTyXb0am3s5ZwwlUTpmqzgY5tIwR9TYR0wjIaQIvIxBrFy+9mK82dansxaTBH5F/ef+LQYPyimk/ZgkNxtNzlwCauLhofvq6Yef0JVyFcN3v",
      PGUSER:
        "AgBzByaq7ERJv4tyWgNdLJoZwbdcDe31UIhitM1CQI9LUhBXTBAKUghkLksrmxu5hkxnp5/Cj78j35FwbX+UQ4vgu3CYRLeh4wqxxwmhuH1oP6pvt312PBpo5upBrbYgGVKRGdT7ph1d8J3RVFTalPIb2NsnGveG2bhkTXmKHim8vE4rD6CZ/WS3KdyYBGqp2LiaCeNq6Ns5oABkBIsd3cKjVpCmLe8PlM/8xHh+PgGcqj/QpQY5umkNhA8cJphtJT3AeaObZOOpFvwOKE8jT6IHOCY18cowmDe7RaH7wbF8uV1zx6K/9vlFNZY5+SAkAF+iqcdCdRidHzH620lVs8JpBjwvFbq0gHnRyfhA7RVH15LIo4qMUtiNsAAM7+KKU+hO7Qb6iKGtWSPb3d1uH9xdkvofRu9qGd9vxGLYRZrjBpdd49KtfP3g99DaZnr3mGR8wd73cJrWG7SpV8rvzjWG0tw9W1+YD5haK5AeG42dWqdjH3gCaDBPhLvx1XYzFntRijQ2Jr59W4dX0eu/fvKVAAQxQORl8bEYVHtK6961kexOPvAgYayrNG1tCG3dldZO3zP4rILxzGHmbvYj06FhJUzE+EqPRwqUD9YCrtFZUf64NX1jqYtk9Qe1c5gX2yCt2thgF1qzoPiyGA+UC3D3RvnkcoaSLtovtjaB252NQGX03cesYhGoZ8yE95buazZ/xT8oejmUDYTMzSE3wXj8DRTVNtyC3U3G980DXbBK7MbqOTDooyBUUw==",
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
