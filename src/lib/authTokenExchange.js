import {
  filter,
  fromPromise,
  fromValue,
  map,
  merge,
  mergeMap,
  pipe,
  share,
  takeUntil,
} from "wonka";
import { getToken, isTokenExpired } from "./auth";

// come from https://gist.github.com/kitten/6050e4f447cb29724546dd2e0e68b470#file-authexchangewithteardown-js

const addTokenToOperation = (operation, token) => {
  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return {
    ...operation,
    context: {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };
};

export const tapExchange = (fn) => ({ forward }) => (ops$) => {
  return pipe(
    ops$,
    map((operation) => {
      fn({ ...operation });
      return operation;
    }),
    forward
  );
};

/**
  This exchange performs authentication and is a recipe.
  The `getToken` function gets a token, e.g. from local storage.
  The `isTokenExpired` function checks whether we need to refresh.
  The `refreshToken` function calls fetch to get a new token and stores it in local storage.
  */

export const authExchange = ({ forward }) => {
  let refreshTokenPromise = null;

  return (ops$) => {
    // We share the operations stream
    const sharedOps$ = pipe(ops$, share);

    const withToken$ = pipe(
      sharedOps$,
      // Filter by non-teardowns
      filter((operation) => operation.operationName !== "teardown"),
      mergeMap((operation) => {
        const refreshTokenFn = operation.context.fetchOptions.refreshToken;
        // check whether the token is expired
        const isExpired = isTokenExpired();
        // If it's not expired then just add it to the operation immediately
        if (!isExpired) {
          return fromValue(addTokenToOperation(operation, getToken()));
        }

        // If it's expired and we aren't refreshing it yet, start refreshing it
        if (isExpired && !refreshTokenPromise) {
          refreshTokenPromise = refreshTokenFn(); // we share the promise
        }

        const { key } = operation;
        // Listen for cancellation events for this operation
        const teardown$ = pipe(
          sharedOps$,
          filter((op) => op.operationName === "teardown" && op.key === key)
        );

        return pipe(
          fromPromise(refreshTokenPromise),
          // Don't bother to forward the operation, if it has been cancelled
          // while we were refreshing
          takeUntil(teardown$),
          map((token) => {
            refreshTokenPromise = null; // reset the promise variable
            return addTokenToOperation(operation, token);
          })
        );
      })
    );

    // We don't need to do anything for teardown operations
    const withoutToken$ = pipe(
      sharedOps$,
      filter((operation) => operation.operationName === "teardown")
    );
    return pipe(merge([withToken$, withoutToken$]), forward);
  };
};
