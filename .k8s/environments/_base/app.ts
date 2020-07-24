//import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  labels: {
    component: "next",
  },
  requests: {
    cpu: "1m",
    memory: "64Mi",
  },
  limits: {
    cpu: "50m",
    memory: "128Mi",
  },
  containerPort: 3000,
  servicePort: 3000,
};
