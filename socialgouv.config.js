const { GitlabConfig, App, Namespace, printYaml } = require("@socialgouv/k8s");
const config = new GitlabConfig(process.env);

printYaml([new Namespace(config), new App("app", config)]);
