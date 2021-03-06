import Head from "next/head";
import React from "react";
import { Button } from "react-bootstrap";
import { withCustomUrqlClient } from "src/components/CustomUrqlClient";
import { Role } from "src/components/Role";
import { useAuth, withAuthProvider } from "src/components/useAuth";
import { Users } from "src/components/Users";

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
