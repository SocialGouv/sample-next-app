import "@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css";

//import * as Sentry from "@sentry/node";
import { init } from "@socialgouv/matomo-next";
import App from "next/app";
import Head from "next/head";
import React from "react";

import Nav from "../components/Nav";

// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
// });

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

class MyApp extends App {
  componentDidMount() {
    console.log({
      NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
    init({ siteId: MATOMO_SITE_ID, url: MATOMO_URL });
  }
  render() {
    const { Component, pageProps } = this.props;

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
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyApp;
