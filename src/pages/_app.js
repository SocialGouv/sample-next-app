//import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css";

import "@gouvfr/all/dist/css/all.css";

import * as Sentry from "@sentry/node";
import { init } from "@socialgouv/matomo-next";
import App from "next/app";
import Head from "next/head";
import React from "react";

import { Layout } from "../components/dse";

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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Layout>
          <Component {...modifiedPageProps} />
        </Layout>
      </React.Fragment>
    );
  }
}

export default MyApp;
