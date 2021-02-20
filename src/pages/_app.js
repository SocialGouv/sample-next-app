import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css";

import * as Sentry from "@sentry/node";
import { init } from "@socialgouv/matomo-next";
import App from "next/app";
import Head from "next/head";
import React from "react";
import Nav from "src/components/Nav";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

class MyApp extends App {
  componentDidMount() {
    init({ siteId: MATOMO_SITE_ID, url: MATOMO_URL });
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
