import { push } from "@socialgouv/matomo-next";
import Head from "next/head";
import React from "react";

import { Button, Link } from "../components/dse";

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
        <Button>Go to page 2</Button>
      </Link>
    </p>

    <p>
      <Link href="/page3">
        <Button>Go to unknown page</Button>
      </Link>
    </p>
    <p>
      <Button onClick={apiCall}>
        trigger api call to /api/answer/anything
      </Button>
    </p>
    <p>
      <Button onClick={faultyApiCall}>trigger api call to /api/faulty</Button>
    </p>
    <p>
      <Button onClick={trackEvent}>trigger Matomo event</Button>
    </p>
    <p>
      <Button onClick={triggerClientError}>
        trigger Sentry client-side error
      </Button>
    </p>
    <p>
      <Link href="/page-error">
        <Button>trigger Sentry server-side error</Button>
      </Link>
    </p>
  </React.Fragment>
);

export default Page;
