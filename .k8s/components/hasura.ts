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
    name: `${params.name}-env`,
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
  },
});

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: { name: `${params.name}-env` },
  },
  {
    secretRef: { name: `${params.name}-env` },
  },
  //   {
  //     secretRef: { name: `azure-pg-user` },
  //   },
];

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`,
  },
  spec: {
    encryptedData: {
      ACCOUNT_EMAIL_SECRET:
        "AgCYU5zQRAGub/7BY2VzhhQ/Y5EtYeWcgdBrHMfOdhK6DLDbkiYTVBvdIVbvUp/AtHP8V3UwT0zoQfKRiECwdH6oJ92GJ2DQ6svTNJH+x4EyQRJTeRMOrx6y+iVAcFx6I5RbT6SdKkpzGztpY4t4pGt3IOUoKNrJRqshj170LQqsw57NyxzSgZ0HONNsHE+HUK6AijgZXBthAfWqlFyrg6WIBY1f/jyuZ7jvzlotTI9JXXSBz8LryNYG7kth2weHcmlQKiqERPbWGFuGwM77hzgFwixjqnrGJEjWXDfsAmBLk+B9nVht2H54pPYCD+cyRea5NeisxnNCAOw10BJHEX1gxgNzSwQDVfOSINWT1a8R81tm7Dz7j3LyKKT+UH8BREHMlu4qv7+D6PjrRXJXtAMGN6Vsz0Hqvf6vlZou7O4ygcAtirRaSPvsuU1FOg2JvwfheUVZ7StBGhsTBWyQ0jw9UqAXcjtcbqfzeOc8sEEe/5xyRJctT+A4s4XNGxiF/Mnaa9XB5OHtz55FUDzy2o0S21JXFjnNs2kmDji3gjPwYJzg+qat7ZcGBNMR4KNvu2SiUoDdQMKzmh7mi4nwqlOv08eJVP8ZzXGS3F8QcsMFXPfrH/53hunKq6gQ61D3+CsCN6Hz89X7FgWnMroMv52gNwtUc0yeQ+klIB2RsY6+NefWx0p+ikxHY9MG64qMPtFNG+RW2TwRgcdbD6CC31GUVmGVLpEF95RF7v1i66H9EvNwiRZCagnZ4qYcrQ==",
      HASURA_GRAPHQL_ADMIN_SECRET:
        "AgCAqhKgc3PtqkQnkPeR0pAyh5bkICHiNpYkHBwRAhRCSo4kktC4p1/OJapMewk2glYBZHdUIad4JEn1V7/EvfMkWs7Eh7CXLYQB8xdJxbl7tyopNSppQxLA2YkMTPmnja5kGJrf2nvZNR1u7aQ7z5ZuP9KFzPsWTj/pFQiczsoyhNrKJmSeAUMRKophVfgKDdvNuM6ZEuSiR9iGhhrGJVD1gHlQaOW0JKCjweuC0opYdP/rlZOD6BvqzlaYc+dHVYbot7ktDzYT98YCIJdS0sKe0/6+L/CQgWeqAUxZxyPrtOk5BsBOXKNuXIrG9sQQ8SXSykubqYRGdClVv6TlazMXvBtuoind14bkJ1G4Are0FsokIPoJxrYAM1Nd4hKvRJvT3BiiEY2JdqRbmeHyZc+yCYUeUkvbtVIHFHGnSjVzAfriR6mLj4psmUGAtjq7qqaa6fJQb1fRr6pnb6//i6B6NjspyMHNi5uwLCn3Rvrqbq0abgtZCh1PUPZeqA/kAENyg3FunPzxiCdlHJnKch7lQDSkoQDukEGWipUnr9/ICfMuAMlu1uTHqjjGrsZoewqY00MHkPNyFiHVwYmEqY9INfmEH9G5UBLaWTorLyvleJUK60d8ZteFArZlskOs82gtcVhYGtE1TZ3VSn/sGKHdC53BlWJ5b65GKP8bn1xKmuu+ah3+NNWkgTydoKzTjHxOiX3FVeDHyVM9v3Xyv/6/Z8KCvRw9cgbmcX+PkTifzsT/10iGvP+aa/8+3tOmikLHHGpTyALG9YOZ4MPOHR5owd1xI0TUm++0+JgxYfeNny+Ybk0O0x/ikVx+gSDR7MKDD9sI2V6wX8cJKpl6hLFIxFV0EUCwHiWW0N5ZnXJarMMhMWzV+4YaD0c6ZxhDgizvIX6nOs0aEihvFBVBgZuiIiO3RW0fUDel0kcqzg==",
      HASURA_GRAPHQL_JWT_SECRET:
        "AgAnThMc6uuayn1BR4rLy65IoFDsv8pzBpphbYxf36e4OJooSi9s2upWe8g3HpVfdb5SthH77uw+64Ks+Tvku1gHrUOOXh89F+RS1mLwBfNhe4Nlf55AosasYsUOjE5mWOd0Czdp723ujL9T1SoZNyGeGyG2ZPxR+clgBJIgX5fRMvfi76SSq5trUasItHflHp+io2leMD8QBB0jukLf8vmHHCZ36S1hwtISj7NMHtiv4bl2AQPj6KjyO2U0AB+Uf+Un21RwCRsXv4mDkKNZAGSMn67IkqLRK02TFJQRz4qn+WrX4DPkgNG+fELYHBK0CSi8orSN07Z0qY4y86IYbXRiqJDDKIXq6jNQ2V3Ffox8uNNPk8BJ4lrxz4Bn9r9/rTWRLS70Uzv+OXViJ2xcb4HxBZFSKucOVK4Gx8kFf5xoKd6LV6g6kbjtYQUR4FGQihvZYsDrr5qGv1rxHO7EkY4o9Hre2iHVQJ08imfDoXscfzeJC9lxo/e5M7LusDtIkzwkMkmsv8WXMlGjfg4JoYiQzVA8oMsmeWQLHNdJUdSkZF8tFc3skvgYEeMuDi89KRiuCOwnShrVLzPzYbWO+7dwnyay5NVvtvNE9kXYn5U4EwGExeLGWoRRrDCOUM9sgwAJF7AcDcQUQ+MWupWacW7YE+VjBMuDmJR+1Gx9qDXGUspG1DkDfKqLCxT1L2RoMlbIfubACEYYbZ5IiooqjwbHCMUzbr4aRNSM2C3KqN8wSlB18xVfrgVpWYqZFtXWjJAgvLbn5Pi6ryaBPy/adnlBpGf1S2EakV9uR6gdpsKR1yTmzNT7MCIiInzvq/KijQCiJwAyqIkpU+tQv+HInHxWZQ==",
    },
    template: {
      type: "Opaque",
      metadata: {
        annotations: {
          "sealedsecrets.bitnami.com/cluster-wide": "true",
        },
        ...metadataFromParams(params),
        name: `${params.name}-env`,
      },
    },
  },
});

//

export default [secret, deployment, ingress, service, envConfigMap];
