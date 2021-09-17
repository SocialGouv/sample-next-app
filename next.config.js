const nextSourceMaps = require("@zeit/next-source-maps");
const { withSentryConfig } = require("@sentry/nextjs");

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  //silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  nextSourceMaps({
    // env: {
    //   NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
    //   NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
    // },
    webpack: (config, { isServer /*, buildId */ }) => {
      // config.plugins.push(
      //   new webpack.DefinePlugin({
      //     // looks like it doesnt work for some reason
      //     "process.env.SENTRY_RELEASE": JSON.stringify(buildId),
      //   })
      // );

      if (!isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser";
      }

      return config;
    },
  }),
  SentryWebpackPluginOptions
);
