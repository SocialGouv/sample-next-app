# sample next.js app [![pipeline status](https://gitlab.factory.social.gouv.fr/SocialGouv/sample-next-app/badges/master/pipeline.svg)](https://gitlab.factory.social.gouv.fr/SocialGouv/sample-next-app/commits/master)

https://sample-next-app.fabrique.social.gouv.Fr

A sample SSR Next.js app with :

- ✅ sentry
- ✅ matomo
- ✅ jest tests
- ✅ [@SocialGouv linters](https://github.com/SocialGouv/linters/)
- ✅ [@SocialGouv bootstrap](https://github.com/SocialGouv/bootstrap)
- ✅ @SocialGouv polyfill.io
- ✅ precommit hooks
- ✅ docker build
- ✅ gitlab-ci
  - ✅ quality
  - ✅ docker build+push
  - ⏳ releases + changelog
  - ✅ features-branches envs
  - ⏳ prod env

## Production

### Env vars

⚠ You need to set client-side browser `process.env` variables **at build time**.

In docker this is done with `--build-arg`.

| Var            | desc                       | build time | run time |
| -------------- | -------------------------- | :--------: | :------: |
| PORT           | port to run the server on  |            |    ✅    |
| SENTRY_DSN     | DSN of your sentry project |     ✅     |
| SENTRY_TOKEN   | token to allow sourcemaps  |     ✅     |
| MATOMO_URL     | URL to your piwik instance |     ✅     |
| MATOMO_SITE_ID | site id on piwik instance  |     ✅     |

### Docker build

```sh
docker build \
  --build-arg SENTRY_DSN="https://[hash]@url.sentry.com/42" \
  --build-arg SENTRY_TOKEN="1234" \
  --build-arg MATOMO_URL="https://url.matomo.com" \
  --build-arg MATOMO_SITE_ID=42 \
  . -t sample-next-app
```

### Docker run

```sh
docker run -it --init --rm -p 3000:3000 sample-next-app
```

## Tips

- 3rd party libs (ex: some of @sindresorhus modules) may not be ES3 compatible (breaks IE11) and wont be babelified by Next.js. You can locally import the code, make a PR to the upstream project to [publish babelified version](https://github.com/elijahmanor/cross-var/pull/7/files) or use [next-transpile-modules](https://github.com/martpie/next-transpile-modules)
- 3rd party libs may needs to be fixed to handle SSR correctly
- Follow https://github.com/zeit/next.js/tree/canary/examples/
