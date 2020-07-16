import { migrateString } from "@kosko/migrate";
import { readFileSync } from "fs";

export function koskoMigrateLoader(id: string): string {
  return migrateString(readFileSync(id, "utf-8"));
}
