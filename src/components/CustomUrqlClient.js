import { pipe, filter, mergeMap, fromPromise, fromValue, map } from "wonka";
import { dedupExchange, cacheExchange, fetchExchange } from "@urql/core";
import { withUrqlClient } from "next-urql";
import { getToken } from "../lib/auth";

const isPromise = (value) => {
  console.log("isPromise", typeof value?.then === "function");
  return typeof value?.then === "function";
};

const fetchOptionsExchange = (fn) => ({ forward }) => (ops$) => {
  return pipe(
    ops$,
    filter((operation) => operation.operationName === "query"),
    mergeMap((operation) => {
      console.log("[ mergemap ]", operation);
      const result = fn(operation.context.fetchOptions);
      return pipe(
        isPromise(result) ? fromPromise(result) : fromValue(result),
        map((fetchOptions) => {
          console.log("resolved", { fetchOptions });
          return {
            ...operation,
            context: { ...operation.context, fetchOptions },
          };
        })
      );
    }),
    forward
  );
};

export function withCustomUrqlClient(Component) {
  return withUrqlClient(
    (ctx) => ({
      url: "/graphql",
      fetchOptions: {
        getToken: () => getToken(ctx),
      },
    }),
    (ssrExchange) => [
      dedupExchange,
      cacheExchange,
      ssrExchange,
      fetchOptionsExchange((fetchOptions) =>
        fetchOptions.getToken().then((token) => ({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }))
      ),
      fetchExchange,
    ]
  )(Component);
}
