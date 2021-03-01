import React from "react";
import { useQuery } from "urql";

import { Callout } from "./dse";

const query = `
query getUser {
  users {
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

export function Users() {
  const [result] = useQuery({
    query,
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>chargement...</p>;
  if (error)
    return (
      <div className="alert alert-warning">
        <pre>{JSON.stringify(error, 0, 2)}</pre>
      </div>
    );
  return data.users.map(({ id, name }) => (
    <Callout key={id} variant="info">
      {name}
    </Callout>
  ));
}
