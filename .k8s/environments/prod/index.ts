//

import { dirname } from "path"
import type { GlobalEnvironment } from "../../types";

const you = process.env.USERNAME || process.env.USER || "toto";
const prefix = you.toLowerCase();

const env: GlobalEnvironment = {
  namespaceName: `${dirname(__dirname)}-localhost-${prefix}`,
  //
  domain: process.env.KUBE_INGRESS_BASE_DOMAIN || "dev.fabrique.social.gouv.fr",
  subdomain: `${prefix}-localhost-${dirname(__dirname)}`,
  subdomainSeparator: "-",
};

export default env;
