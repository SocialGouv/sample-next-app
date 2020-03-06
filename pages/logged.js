import React from "react";
import Link from "next/link";
import { withAuthSync } from "../utils/auth";

const Logged = () => (
  <>
    <p>
      <Link href="/">
        <a>Go to index</a>
      </Link>
    </p>
    <p className="lead">Welcome to logged page</p>
  </>
);

export default withAuthSync(Logged);
