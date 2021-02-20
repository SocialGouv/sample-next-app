import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css";

import * as Sentry from "@sentry/node";
import App from "next/app";
import Head from "next/head";
import React from "react";
import Nav from "src/components/Nav";

import { initMatomo } from "../matomo";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

class MyApp extends App {
  componentDidMount() {
    initMatomo({
      piwikUrl: process.env.MATOMO_URL,
      siteId: process.env.MATOMO_SITE_ID,
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
