import React from "react";
import Head from "next/head";

import { withCustomUrqlClient } from "components/CustomUrqlClient";
import { Role } from "components/Role";
import { Users } from "components/Users";
import { withAuthProvider, useAuth } from "components/useAuth";
import { Button } from "react-bootstrap";

export function AdminPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <Head>
        <title>admin | sample next app</title>
      </Head>

      <>
        Hello {user?.name} :
        <br />
        <Button onClick={logout}>logout</Button>
      </>

      <Users />
      <Role />
    </>
  );
}

export default withCustomUrqlClient(withAuthProvider(AdminPage));
