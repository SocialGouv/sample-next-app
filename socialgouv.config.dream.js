function createApp(params) {
  const { deployment, ingress, service, configMap, secret } = create(params);
  return [secret, configMap, deployment, ingress, service];
}
export default {
  app: createApp({
    livenessProbePath: ""
  }),
  apii: createApp({
    livenessProbePath: ""
    image: "/api"
  }),
  redis: require('./.k8s/components/redis'),
  api: (env) => {
    const { deployment, ingress, service, configMap, secret } = create({live});


    const configMap = new ConfigMap({
      ...loadYaml(env, "app-env.configmap.yaml"),
      metadata: {
        ...metadataFromParams(params),
        name: `app-env`,
      },
      data: {
        FRONTEND_HOST: ingress.spec!.rules![0].host!,
      },
    });

    deployment.spec.template.spec.initContainers = [
      {
        name: "knex-migrate",
        image: deployment.spec.template.spec.containers[0].image,
        command: ["yarn"],
        args: ["migrate"],
        resources: {
          requests: {
            cpu: "1000m",
            memory: "256Mi",
          },
          limits: {
            cpu: "1000m",
            memory: "256Mi",
          },
        },
        envFrom: [
          {
            secretRef: {
              name: secret.name,
            },
          },
          {
            configMapRef: {
              name: configMap.name,
            },
          },
        ],
      },
    ];

    configMap.data = {
      ...configMap.data
      FRONTEND_HOST: ingress.spec.rules![0].host,
    }

    return [secret, configMap, deployment, ingress, service];
  }
}
