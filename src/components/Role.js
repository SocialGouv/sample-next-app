import React from "react";
import { Alert, Badge } from "react-bootstrap";
import { useQuery } from "urql";

const query = `
query getRoles{
  roles {
    role
  }
}
`;
export function Role() {
  const [results] = useQuery({ query });
  const { data, error, fetching } = results;

  if (fetching) return <p>loading</p>;
  if (error)
    return (
      <Alert variant="warning">
        <pre>{JSON.stringify(error, 0, 2)}</pre>
      </Alert>
    );
  return (
    <p>
      {data.roles.map(({ role }) => (
        <Badge variant="dark" key={role}>
          {role}
        </Badge>
      ))}
    </p>
  );
}
