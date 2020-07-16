import env from "./namespaces";

test("should return empty info", () => {
  expect(env({})).toMatchInlineSnapshot(`
    Object {
      "annotations": Object {
        "field.cattle.io/creatorId": "gitlab",
        "field.cattle.io/projectId": "",
        "git/branch": "",
        "git/remote": "",
      },
      "labels": Object {
        "cert": "wildcard",
      },
    }
  `);
});

test("should return the gitlab global env", () => {
  expect(
    env({
      CI_COMMIT_REF_NAME: "my-branch-name",
      CI_REPOSITORY_URL: "git@github.com:SocialGouv/sample-next-app.git",
      RANCHER_PROJECT_ID: "c-kk8xm:p-4fxg8",
    })
  ).toMatchInlineSnapshot(`
    Object {
      "annotations": Object {
        "field.cattle.io/creatorId": "gitlab",
        "field.cattle.io/projectId": "c-kk8xm:p-4fxg8",
        "git/branch": "my-branch-name",
        "git/remote": "git@github.com:SocialGouv/sample-next-app.git",
      },
      "labels": Object {
        "cert": "wildcard",
      },
    }
  `);
});
