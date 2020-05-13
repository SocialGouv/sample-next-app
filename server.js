const next = require("next");
const express = require("express");
const port = parseInt(process.env.FRONTEND_PORT, 10) || 3000;
const { createProxyMiddleware } = require("http-proxy-middleware");
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

const sourcemapsForSentryOnly = (token) => (req, res, next) => {
  // In production we only want to serve source maps for Sentry
  if (!dev && !!token && req.headers["x-sentry-token"] !== token) {
    res
      .status(401)
      .send(
        "Authentication access token is required to access the source map."
      );
    return;
  }
  next();
};

const faultyRoute = () => {
  throw new Error("Server exception");
};

app.prepare().then(() => {
  // app.buildId is only available after app.prepare(), hence why we setup here
  const { Sentry } = require("./src/sentry")(app.buildId);

  express()
    // This attaches request information to Sentry errors
    .use(Sentry.Handlers.requestHandler())
    .use(
      createProxyMiddleware("/graphql", {
        target: process.env.GRAPHQL_ENDPOINT,
        changeOrigin: true,
        xfwd: true,
        prependPath: false,
        followRedirects: true,
        pathRewrite: { "^/graphql": "/v1/graphql" },
        logLevel: "debug",
        onError: (err, req, res) => {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          // todo: sentry
          res.end("Something went wrong. We've been notified.");
        },
        ws: true, // proxy websockets
      })
    )
    .get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_TOKEN))
    // demo server-exception
    .get("/page-error", faultyRoute)
    // Regular next.js request handler
    .use(handler)
    // This handles errors if they are thrown before reaching the app
    .use(Sentry.Handlers.errorHandler())
    .listen(port, (err) => {
      if (err) {
        throw err;
      }

      console.log("process.env.SENTRY_DSN", process.env.SENTRY_DSN);
      console.log("process.env.SENTRY_TOKEN", process.env.SENTRY_TOKEN);
      console.log("process.env.MATOMO_URL", process.env.MATOMO_URL);
      console.log("process.env.MATOMO_SITE_ID", process.env.MATOMO_SITE_ID);
      console.log("process.env.GRAPHQL_ENDPOINT", process.env.GRAPHQL_ENDPOINT);
      // eslint-disable-next-line no-console
      console.log(`> Ready on http://localhost:${port}`);
    });
});
