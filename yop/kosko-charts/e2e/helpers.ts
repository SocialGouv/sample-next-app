import { config } from "dotenv";
import { resolve } from "path";

export const gitlabEnv = config({ path: resolve(__dirname, "./.gitlab.env") })
  .parsed;
export const BIN_FOLDER = resolve(__dirname, "../node_modules/.bin");
export const KOSKO_BIN = resolve(BIN_FOLDER, "kosko");

export const TIMEOUT = 45_000; // = 1000 * 45s

export const template = (testFilename: string): string => {
  return resolve(__dirname, "../templates/", testFilename);
};
