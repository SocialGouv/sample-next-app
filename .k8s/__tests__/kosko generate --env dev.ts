//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);
test("kosko generate --dev", async () => {
  expect(
    await getEnvManifests("dev", "", {
      ...project("sample-next-app").dev,
      KUBE_NAMESPACE: "sample-next-app-85-master-dev2",
      RANCHER_PROJECT_ID: "c-bd7z2:p-7ms8p",
    })
  ).toMatchSnapshot();
});
