const { GitlabConfig, App, Namespace, printYaml } = require("@socialgouv/k8s");
const config = new GitlabConfig(process.env);
console.log(config.app);
printYaml([new Namespace(config), new App("hasura", config)]);
