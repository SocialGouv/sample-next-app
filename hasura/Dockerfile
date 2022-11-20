FROM hasura/graphql-engine:v2.15.1

ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false

ENV HASURA_GRAPHQL_SERVER_PORT=8080

USER 1001

COPY ./migrations /hasura-migrations
COPY ./metadata /hasura-metadata
