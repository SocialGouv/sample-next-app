import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { ok } from "assert";

export default (env = process.env): AppComponentEnvironment => {
  const name = "www";

  ok(env.CI_REGISTRY_IMAGE, "Expect CI_REGISTRY_IMAGE");
  ok(env.CI_COMMIT_SHA, "Expect CI_COMMIT_SHA");

  return {
    name: name,
    image: {
      name: env.CI_REGISTRY_IMAGE,
      tag: env.CI_COMMIT_TAG ? env.CI_COMMIT_TAG.slice(1) : env.CI_COMMIT_SHA,
    },
    ingress: {
      secretName: env.PRODUCTION ? `${name}-crt` : "wildcard-crt",
    },
    labels: {
      component: "www",
    },
    requests: {
      cpu: "1m",
      memory: "64Mi",
    },
    limits: {
      cpu: "1000m",
      memory: "514Mi",
    },
    containerPort: 3000,
    servicePort: 80,
  };
};
