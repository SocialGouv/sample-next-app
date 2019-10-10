import React from "react";
import Link from "next/link";

import { matopush } from "../matomo";

const triggerClientError = () => {
  throw new Error("Client-side error");
};

const trackEvent = () => {
  matopush(["trackEvent", "click", "button-test-matomo"]);
};

const Page = () => (
  <React.Fragment>
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
