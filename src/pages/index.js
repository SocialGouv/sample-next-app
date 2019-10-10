import React from "react";
import Link from "next/link";

const triggerClientError = () => {
  throw new Error("Client-side error");
};

const Page = () => (
  <div className="container">
    <div className="jumbotron">
      <h1 className="display-4">Hello, SocialGouv!</h1>
      <p className="lead">Welcome to this Next.js sample project</p>
    </div>

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
      <button className="btn btn-primary">trigger Matomo event</button>
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
  </div>
);

export default Page;
