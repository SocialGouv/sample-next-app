import React from "react";
import App from "next/app";
import Head from "next/head";

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

class MyApp extends App {
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
        <Component {...modifiedPageProps} />
      </React.Fragment>
    );
  }
}

export default MyApp;
