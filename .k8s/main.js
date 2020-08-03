const fs = require("fs");
const toml = require("toml");

const data = toml.parse(
  fs.readFileSync(`${__dirname}/../socialgouv.toml`, "utf-8")
);
console.dir(data);

("use strict");

const env = require("@kosko/env");
const { generate, print, PrintFormat } = require("@kosko/generate");
const { join } = require("path");

(async () => {
  // Set environment
  env.env = "dev";

  // Set CWD (Optional)
  env.cwd = __dirname;

  // Generate manifests
  const result = await generate({
    path: join(env.cwd, "components"),
    components: ["*"],
    baseEnvironment: "_base",
  });

  // Print manifests to stdout
  print(result, {
    format: PrintFormat.YAML,
    writer: process.stdout,
  });
})();
