//

import { gitlabEnv, KOSKO_BIN, template, TIMEOUT } from "e2e/helpers";
// eslint-disable-next-line import/default
import execa from "execa";
import { basename, resolve } from "path";

//

const cwd = template(basename(resolve(__dirname, "..", "..")));

test(
  "--env preprod : should generate dev manifest",
  async () => {
    // Required to allow seemless integration code example
    const result = await execa.node(
      KOSKO_BIN,
      ["generate", "--env", "preprod"],
      {
        cwd,
        env: { ...gitlabEnv, CI_COMMIT_TAG: "v1.2.3" },
      }
    );

    expect(result.stdout).toMatchSnapshot();
    expect(result.exitCode).toEqual(0);
  },
  TIMEOUT
);
