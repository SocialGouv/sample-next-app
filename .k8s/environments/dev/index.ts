//

import type { GlobalEnvironment } from "../../types";


const env: Partial<GlobalEnvironment> = {
  domain: process.env.KUBE_INGRESS_BASE_DOMAIN,
};

export default env;
