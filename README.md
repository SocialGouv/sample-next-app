# sample next.js app


https://sample-next-app.fabrique.social.gouv.Fr

A sample SSR Next.js app with :

- ✅ sentry
- ✅ [matomo](https://github.com/SocialGouv/next-matomo)
- ✅ jest tests
- ✅ [@SocialGouv linters](https://github.com/SocialGouv/linters/)
- ✅ [@SocialGouv bootstrap](https://github.com/SocialGouv/bootstrap)
- ✅ precommit hooks
- ✅ docker-compose for local dev
- ✅ socialgouv github actions

## Development

Start hasura and local postgres using

```sh
docker-compose up
```

Hasura migrations and metadata will be automatically applied.

to launch the Hasura console, you can run the command

```sh
hasura console --envfile ../.env --project hasura
```

And then launch the frontend (next.js app) using

```sh
yarn dev
```

## Production

### Env vars

⚠ You need to set client-side browser `process.env` variables **at build time**.

In docker this is done with `--build-arg`.

| Var                        | desc                        |
| -------------------------- | --------------------------- |
| PORT                       | port to run the server on   |
| NEXT_PUBLIC_SENTRY_DSN     | DSN of your sentry project  |
| SENTRY_TOKEN               | token to allow sourcemaps   |
| NEXT_PUBLIC_MATOMO_URL     | URL to your matomo instance |
| NEXT_PUBLIC_MATOMO_SITE_ID | site id on matomo instance  |

### Docker build

```sh
docker build . -t sample-next-app
```

### Docker run

```sh
docker run -it --init --rm -p 3000:3000 sample-next-app
```

## Tips

- 3rd party libs (ex: some of @sindresorhus modules) may not be ES3 compatible (breaks IE11) and wont be babelified by Next.js. You can locally import the code, make a PR to the upstream project to [publish babelified version](https://github.com/elijahmanor/cross-var/pull/7/files) or use [next-transpile-modules](https://github.com/martpie/next-transpile-modules)
- 3rd party libs may needs to be fixed to handle SSR correctly
- Follow https://github.com/zeit/next.js/tree/canary/examples/
