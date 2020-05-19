//

import { dirname, basename, join } from "path"
import type { GlobalEnvironment } from "../../types";

const you = process.env.USERNAME || process.env.USER || "toto";
const prefix = you.toLowerCase();
const project = basename(join(dirname(__dirname), "..", ".."));

const env: GlobalEnvironment = {
  namespaceName: `${project}-localhost-${prefix}`,
  //
  domain: process.env.KUBE_INGRESS_BASE_DOMAIN || "dev.fabrique.social.gouv.fr",
  subdomain: `${prefix}-localhost-${project}`,
  subdomainSeparator: "-",
};

export default env;
