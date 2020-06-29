//

import type {
  GlobalEnvironment,
  NamespaceComponentEnvironment,
  NamedComponentEnvironment,
} from "@socialgouv/kosko-charts/types";
import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

// Declare types for component environment variables
export interface ComponentEnvironment {
  // Fallback type of all other component variables which are not specified below
  [key: string]: {};

  // Specify types for each component
  namespace: NamespaceComponentEnvironment;
  app: AppComponentEnvironment;
  hasura: AppComponentEnvironment;
  pgweb: AppComponentEnvironment;
  "create-db": CreateDbEnvironment;
}

// Declare types for component environment variables
export interface CreateDbEnvironment extends NamedComponentEnvironment {
  dbName: string;
  dbUser: string;
  dbPassword: string;
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
