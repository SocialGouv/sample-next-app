const nextSourceMaps = require("@zeit/next-source-maps");
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextSourceMaps({
    // by default, sentry tries to upload sourcemaps at build time
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#configure-source-maps
    sentry: {
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
    },
    webpack: (config, { isServer /*, buildId */ }) => {
      if (!isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser";
      }

      return config;
    },
  })
);
