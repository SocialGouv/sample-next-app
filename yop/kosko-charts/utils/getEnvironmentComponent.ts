import { Environment } from "@kosko/env";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { formatPath } from "@kosko/env/dist/paths.js";
import { readFileSync } from "fs";
import { Module } from "module";
import { join } from "path";
import { runInThisContext } from "vm";

export function getEnvironmentComponent(
  { env, cwd, paths: { component } }: Environment,
  filename: string,
  { loader }: { loader: (id: string) => string }
): unknown[] {
  if (!env) return [];
  const envs = Array.isArray(env) ? env : [env];
  const legitEnv = envs.reverse().find((env) => {
    const path = formatPath(component, {
      component: filename,
      environment: env,
    });
    try {
      return readFileSync(join(cwd, path));
    } catch {
      return false;
    }
  });

  if (!legitEnv) return [];
  return tryRequireComponent(loader)(
    formatPath(component, {
      component: filename,
      environment: legitEnv,
    })
  );
}

export function tryRequireComponent(loader: (id: string) => string) {
  return (id: string): unknown[] => {
    const mod = new Module("");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    runInThisContext(Module.wrap(loader(id)))(
      mod.exports,
      require,
      mod,
      "",
      ""
    );
    return mod.exports as unknown[];
  };
}
