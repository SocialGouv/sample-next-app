import { load } from "./config";
import { ok } from "assert";
import { join } from "path";
import { generate as koskoGenerate, print, PrintFormat } from "@kosko/generate";
import { create } from "./charts/namespace";
export async function generate() {
  const config = await load();
  // console.log(config);
  // console.log(create);
  require("dotenv/config");
  // require("ts-node/register");

  // print(result, { format: PrintFormat.YAML, writer: process.stdout });
  // const { default: sdf } = await import("../kosko/components/namespace");
  // console.log(sdf);
  ok(process.env.CI_PROJECT_NAME);
  const manifests = [];
  manifests.push({
    path: "sdf",
    index: 0,
    data: create({
      name: process.env.CI_PROJECT_NAME,
      labels: {},
      annotations: {},
    }),
  });

  // require("ts-node/register");
  // const result = await koskoGenerate({
  //   path: join(process.cwd(), ".k8s", "components"),
  //   components: ["*"],
  //   extensions: [".ts"],
  //   validate: true,
  // });
  // manifests.push(...result.manifests);

  print(
    {
      manifests,
    },
    { format: PrintFormat.YAML, writer: process.stdout }
  );
}
