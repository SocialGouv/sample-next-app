const nextSourceMaps = require("@zeit/next-source-maps");

module.exports = nextSourceMaps({
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

    // if (!isServer) {
    //   config.resolve.alias["@sentry/node"] = "@sentry/browser";
    // }

    return config;
  },
});
