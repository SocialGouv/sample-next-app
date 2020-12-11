//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);
test("kosko generate --preprod", async () => {
  expect(
    await getEnvManifests("preprod", "", {
      ...project("sample-next-app").preprod,
      KUBE_NAMESPACE: "sample-next-app-85-preprod-dev2",
      RANCHER_PROJECT_ID: "c-bd7z2:p-7ms8p",
    })
  ).toMatchSnapshot();
});
