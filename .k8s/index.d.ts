//

import type {
  AppComponentEnvironment,
  GlobalEnvironment,
  NamespaceComponentEnvironment,
} from "@socialgouv/kosko-charts/types";

// Declare types for component environment variables
export interface ComponentEnvironment {
  // Fallback type of all other component variables which are not specified below
  [key: string]: {};

  // Specify types for each component
  namespace: NamespaceComponentEnvironment;
  app: AppComponentEnvironment;
}

// Extend type declarations of "@kosko/env" module
declare module "@kosko/env" {
  // Extend Environment interface
  interface Environment {
    global(): GlobalEnvironment;

    component<K extends string>(
      name: K
    ): GlobalEnvironment & ComponentEnvironment[K];
  }
}
