import React from "react";

const Page = () => (
  <div className="container">
    <div className="jumbotron">
      <h1 className="display-4">Hello, SocialGouv!</h1>
      <p className="lead">Welcome to this Next.js sample project</p>
    </div>

    <p>
      <button className="btn btn-primary">trigger Matomo event</button>
    </p>
    <p>
      <button className="btn btn-warning">
        trigger Sentry client-side error
      </button>
    </p>
    <p>
      <button className="btn btn-warning">
        trigger Sentry server-side error
      </button>
    </p>
  </div>
);

export default Page;
