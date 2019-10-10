import React from "react";
import App from "next/app";
import Head from "next/head";
import * as Sentry from "@sentry/node";
import GitHubForkRibbon from "react-github-fork-ribbon";

import { initMatomo } from "../matomo";

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

class MyApp extends App {
  componentDidMount() {
    initMatomo({
      siteId: process.env.MATOMO_SITE_ID,
      piwikUrl: process.env.MATOMO_URL
    });
  }
  render() {
    const { Component, pageProps } = this.props;

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props;
    const modifiedPageProps = { ...pageProps, err };

    return (
      <React.Fragment>
        <Head>
          <title>sample-next-app</title>
        </Head>
        <GitHubForkRibbon
          href="//github.com/SocialGouv/sample-next-app"
          target="_blank"
          position="right"
          color="green"
        >
          Clone-moi sur GitHub
        </GitHubForkRibbon>
        <div className="container">
          <div className="jumbotron">
            <h1 className="display-4">Hello, SocialGouv!</h1>
            <p className="lead">Welcome to this Next.js sample project</p>
          </div>
          <div className="row">
            <div className="col">
              <Component {...modifiedPageProps} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyApp;
