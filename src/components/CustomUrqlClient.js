import { dedupExchange, cacheExchange, fetchExchange } from "@urql/core";
import { withUrqlClient } from "next-urql";
import { refreshToken } from "../lib/auth";
import { authExchange, tapExchange } from "lib/authTokenExchange";

export function withCustomUrqlClient(Component) {
  return withUrqlClient(
    (ctx) => ({
      url: "/graphql",
      fetchOptions: {
        refreshToken: () => refreshToken(ctx),
      },
    }),
    (ssrExchange) => [
      dedupExchange,
      cacheExchange,
      ssrExchange,
      authExchange,
      tapExchange((op) => console.log("tap", op.operationName)),
      fetchExchange,
    ]
  )(Component);
}
