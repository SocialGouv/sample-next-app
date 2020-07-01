//
//
//
//
//

// TODO(douglasduteil): move this function to `@socialgouv/kosko-chart`

//
//
//
//
//

import { readFileSync } from "fs";
import { Environment } from "@kosko/env";
import { join } from "path";
// @ts-ignore
import { formatPath } from "@kosko/env/dist/paths.js";
import { migrateString } from "@kosko/migrate";
import { Module } from "module";
import { runInThisContext } from "vm";

export function getEnvironmentComponent(
  { env, cwd, paths: { component } }: Environment,
  filename: string,
  { loader }: { loader: (id: string) => string }
) {
  if (!env) return [];
  const envs = Array.isArray(env) ? env : [env];
  const legitEnv = envs.reverse().find((env) => {
    const path = formatPath(component, {
      environment: env,
      component: filename,
    });
    try {
      return readFileSync(join(cwd, path));
    } catch (e) {
      // console.log(e);
    }
  });

  if (!legitEnv) return [];
  return tryRequireComponent(loader)(
    formatPath(component, {
      environment: legitEnv,
      component: filename,
    })
  );
}

export function tryRequireComponent(loader: (id: string) => string) {
  return (id: string) => {
    const mod = new Module("");
    runInThisContext(Module.wrap(loader(id)))(
      mod.exports,
      require,
      mod,
      "",
      ""
    );
    return mod.exports;
  };
}

// TODO: export to kosko-charts
export function loadYaml(env: Environment, path: string) {
  const [obj] = getEnvironmentComponent(env, path, {
    loader: koskoMigrateLoader,
  });
  return obj;
}

export function koskoMigrateLoader(id: string) {
  return migrateString(readFileSync(id, "utf-8"));
}
