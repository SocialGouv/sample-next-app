# sample next.js app

A sample SSR Next.js app with :

- [x] sentry
- [x] matomo
- [x] docker
- [ ] Jest tests
- [x] @SocialGouv linters
- [x] @SocialGouv bootstrap
- [x] @SocialGouv polyfill.io
- [x] precommit hooks
- gitlab-ci
  - [ ] quality
  - [ ] docker build+push
  - [ ] releases + changelog
  - [ ] features-branches
  - [ ] prod

## Production

### Env vars

⚠ You need to set client-side browser `process.env` variables **at build time**.

In docker this is done with `--build-arg`.

| Var            | desc                       |
| -------------- | -------------------------- |
| SENTRY_DSN     | DSN of your sentry project |
| SENTRY_TOKEN   | token to allow sourcemaps  |
| PORT           | port to run the server on  |
| MATOMO_URL     | URL to your piwik instance |
| MATOMO_SITE_ID | site id on piwik instance  |

### Docker build

```sh
docker build \
  --build-arg SENTRY_DSN="https://[hash]@url.sentry.com/42" \
  --build-arg MATOMO_URL="https://url.matomo.com" \
  --build-arg MATOMO_SITE_ID=42 \
  . -t sample-next-app
```

### Run

```sh
docker run --rm -p 3000:3000 sample-next-app
```

## Sources

- https://github.com/zeit/next.js/tree/canary/examples/with-sentry
