import { push } from "@socialgouv/matomo-next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const triggerClientError = () => {
  throw new Error("Client-side error");
};

const trackEvent = () => {
  push(["trackEvent", "click", "button-test-matomo"]);
};

const apiCall = () =>
  fetch("/api/answer/anything")
    .then((r) => r.json())
    .then((data) => alert(data.answer));

const faultyApiCall = () =>
  fetch("/api/faulty")
    .then((r) => r.json())
    .then((data) => alert(data.answer));

const Page = () => (
  <React.Fragment>
    <Head>
      <title>Home | sample next app</title>
    </Head>
    <p>
      <Link href="/page2">
        <a>Go to page 2</a>
      </Link>
    </p>

    <p>
      <Link href="/page3">
        <a>Go to unknown page</a>
      </Link>
    </p>
    <p>
      <button className="btn btn-primary" onClick={apiCall}>
        trigger api call to /api/answer/anything
      </button>
    </p>
    <p>
      <button className="btn btn-primary" onClick={faultyApiCall}>
        trigger api call to /api/faulty
      </button>
    </p>
    <p>
      <button className="btn btn-primary" onClick={trackEvent}>
        trigger Matomo event
      </button>
    </p>
    <p>
      <button className="btn btn-warning" onClick={triggerClientError}>
        trigger Sentry client-side error
      </button>
    </p>
    <p>
      <Link href="/page-error">
        <button className="btn btn-warning">
          trigger Sentry server-side error
        </button>
      </Link>
    </p>
  </React.Fragment>
);

export default Page;
