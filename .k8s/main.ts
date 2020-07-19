import { readFileSync } from "fs";
import { parse } from "toml";

const data = parse(readFileSync("./socialgouv.toml", "utf-8"));
console.dir(data);
