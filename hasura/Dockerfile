FROM hasura/graphql-engine:v1.2.1.cli-migrations-v2
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false
COPY ./migrations /hasura-migrations
COPY ./metadata /hasura-metadata
