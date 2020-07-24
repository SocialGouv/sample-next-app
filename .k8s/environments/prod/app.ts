export default {
  subdomain: `beta-${process.env.CI_PROJECT_NAME as string}`,
};
