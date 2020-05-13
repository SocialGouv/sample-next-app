import React from "react";
import { useQuery } from "urql";
import { withCustomUrqlClient } from "../components/CustomUrqlClient";

const AdminQuery = `
query getUser {
  user: users {
    id
    email
    name
    active
    default_role
    roles {
      role
    }
  }
}
`;

export function AdminPage() {
  const [result] = useQuery({
    query: AdminQuery,
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>chargement...</p>;
  if (error)
    return (
      <div className="alert alert-warning">
        <pre>{JSON.stringify(error, 0, 2)}</pre>
      </div>
    );
  return (
    <div className="alert alert-success">
      <pre>{JSON.stringify(data, 0, 2)}</pre>
    </div>
  );
}

export default withCustomUrqlClient(AdminPage);
