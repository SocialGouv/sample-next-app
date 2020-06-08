import { dedupExchange, cacheExchange, fetchExchange } from "@urql/core";
import { withUrqlClient } from "next-urql";
import { refreshToken } from "src/lib/auth";
import { authExchange } from "src/lib/authTokenExchange";

export const withCustomUrqlClient = (Component) =>
  withUrqlClient(
    (ctx) => {
      let hostname = "";
      if (ctx?.req) {
        hostname = `${ctx.req.protocol}://${ctx.req.headers.host}`;
      }
      return {
        requestPolicy: "cache-and-network",
        url: `${hostname}/graphql`,
        fetchOptions: {
          refreshToken: () => refreshToken(ctx),
        },
      };
    },
    (ssrExchange) => [
      dedupExchange,
      // TODO create an InvalidatableCacheExcahge so
      // we can invalidate cache after a logout
      cacheExchange,
      ssrExchange,
      authExchange,
      // tapExchange((op) => console.log("tap", op.operationName)),
      fetchExchange,
    ]
  )(Component);
