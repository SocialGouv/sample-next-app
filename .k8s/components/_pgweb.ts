import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/pgweb";

const manifests = create("pgweb", { env });

export default manifests;
