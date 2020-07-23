import { parse } from "toml";

import { readFile } from "fs/promises";
import toml from "toml";

export interface Config {}

export async function load(): Promise<Config> {
  let configFile;
  try {
    configFile = await readFile("./socialgouv.toml", "utf-8");
  } catch {
    configFile = "";
  }
  return toml.parse(configFile);
}
