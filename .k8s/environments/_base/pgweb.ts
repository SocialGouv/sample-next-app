import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";

export default {
  name: "pgweb",
  subdomain: `pgweb-${process.env.CI_PROJECT_NAME as string}`,
  image: {
    name: "sosedoff/pgweb",
    tag: "0.11.6",
  },
  ingress: {
    secretName: process.env.PRODUCTION ? "www-crt" : "wildcard-crt",
  },
  labels: {
    component: "pgweb",
  },
  requests: {
    cpu: "1m",
    memory: "64Mi",
  },
  limits: {
    cpu: "50m",
    memory: "128Mi",
  },
  containerPort: 8081,
  servicePort: 8081,
} as Readonly<AppComponentEnvironment>;
