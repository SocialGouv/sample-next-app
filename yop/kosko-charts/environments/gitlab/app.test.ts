import env from "./app";

test("should return empty info", () => {
  expect(env({})).toMatchInlineSnapshot(`
    Object {
      "containerPort": 8080,
      "image": Object {
        "name": undefined,
        "tag": undefined,
      },
      "ingress": Object {
        "secretName": "wildcard-crt",
      },
      "labels": Object {
        "component": "www",
      },
      "limits": Object {
        "cpu": "50m",
        "memory": "128Mi",
      },
      "name": "www",
      "requests": Object {
        "cpu": "1m",
        "memory": "64Mi",
      },
      "servicePort": 80,
    }
  `);
});

test("should return the gitlab global env", () => {
  expect(
    env({
      CI_COMMIT_SHA: "c58c0974f7023063b1296d3a5a285b46b92771f8",
      CI_COMMIT_TAG: "vX.Y.Z",
      CI_REGISTRY_IMAGE:
        "registry.gitlab.factory.social.gouv.fr/socialgouv/sample-next-app",
      PRODUCTION: "true",
    })
  ).toMatchInlineSnapshot(`
    Object {
      "containerPort": 8080,
      "image": Object {
        "name": "registry.gitlab.factory.social.gouv.fr/socialgouv/sample-next-app",
        "tag": "X.Y.Z",
      },
      "ingress": Object {
        "secretName": "www-crt",
      },
      "labels": Object {
        "component": "www",
      },
      "limits": Object {
        "cpu": "50m",
        "memory": "128Mi",
      },
      "name": "www",
      "requests": Object {
        "cpu": "1m",
        "memory": "64Mi",
      },
      "servicePort": 80,
    }
  `);
});
