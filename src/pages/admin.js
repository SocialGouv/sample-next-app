import React from "react";
import Head from "next/head";
import { Button } from "react-bootstrap";

import { withCustomUrqlClient } from "src/components/CustomUrqlClient";
import { Role } from "src/components/Role";
import { Users } from "src/components/Users";
import { withAuthProvider, useAuth } from "src/components/useAuth";

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
