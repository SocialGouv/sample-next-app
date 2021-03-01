import React from "react";
import { useQuery } from "urql";

import { Callout, Tag } from "./dse";

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
      <Callout variant="warning">
        <pre>{JSON.stringify(error, 0, 2)}</pre>
      </Callout>
    );
  return (
    <p>
      {data.roles.map(({ role }) => (
        <Tag variant="dark" key={role}>
          {role}
        </Tag>
      ))}
    </p>
  );
}
