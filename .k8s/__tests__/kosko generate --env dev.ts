//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";

jest.setTimeout(1000 * 60);
test("kosko generate --dev", async () => {
  expect(await getEnvManifests("dev")).toMatchSnapshot();
});
