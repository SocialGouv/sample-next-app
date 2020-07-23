import { print, PrintFormat, Manifest } from "@kosko/generate";
export function printYaml(manifests: any[]) {
  print(
    {
      manifests: manifests.map((data: any, index: number) => ({
        path: "sdf",
        index,
        data,
      })),
    },
    { format: PrintFormat.YAML, writer: process.stdout }
  );
}
