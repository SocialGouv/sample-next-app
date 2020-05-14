import React from "react";
import { withCustomUrqlClient } from "../components/CustomUrqlClient";
import { Role } from "components/Role";
import { Users } from "components/Users";

export function AdminPage() {
  return (
    <>
      <Users />
      <Role />
    </>
  );
}

export default withCustomUrqlClient(AdminPage);
