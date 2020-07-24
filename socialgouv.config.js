const { GitlabConfig, App, Namespace, printYaml } = require("@socialgouv/k8s");
const config = new GitlabConfig(process.env);
printYaml([
  new Namespace(config),
  new App("app", config, {
    container: {
      ports: [{ containerPort: 4000, name: "http" }],
      resources: {
        limits: {
          cpu: "1000m",
          memory: "256Mi",
        },
      },
    },
  }),
  new App("hasura", config, {
    container: {
      ports: [{ containerPort: 8080, name: "http" }],
      livenessProbe: {
        httpGet: {
          path: "/api/healthz",
        },
      },
      readinessProbe: {
        httpGet: {
          path: "/api/healthz",
        },
      },
      startupProbe: {
        httpGet: {
          path: "/api/healthz",
        },
      },
      resources: {
        requests: {
          memory: "128Mi",
        },
      },
    },
  }),
]);
