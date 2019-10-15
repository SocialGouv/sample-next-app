import React from "react";
import App from "next/app";
import Head from "next/head";
import * as Sentry from "@sentry/node";

import { initMatomo } from "../matomo";
import Nav from "../Nav";

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
        <Nav />
        <div className="container">
          <div className="jumbotron" style={{ marginTop: 40 }}>
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
