export function config(env = process.env) {
  if (!env.CI) {
    // fs.readdd gitlb-ci.env
  }
  return {
    app: {
      image: `%${env.CI_REGISTRY}/app%`,
      // port:
    },
  };
}
