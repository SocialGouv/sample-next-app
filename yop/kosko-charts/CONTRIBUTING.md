# Contributing

> Thanks for being willing to contribute !

## TL;DR

```sh
# Install
$ yarn

# Build
$ yarn build
# Watch the build
$ yarn build --watch

# Lint
$ yarn lint

# Type check
$ yarn typecheck --watch

# Test
$ yarn test
# Watch the test
$ yarn test --watch

# Build
$ yarn e2e
# Watch the e2e
$ yarn e2e --watch
```

## Testing local build

You can link the project with

```js
{
  "devDependencies": {
    "@socialgouv/kosko-charts": "link:../../kosko-charts",
  }
}
```

```
yarn --silent k8s kosko generate --env gitlab

cp ./xxx/charts/xxxx/.gitlab.env ./.k8s/environments/gitlab/.env
DOTENV_CONFIG_PATH=./environments/gitlab/.env yarn --silent k8s kosko generate --require dotenv/config --env gitlab

$ cd e2e/kosko-generate/vanilla
$ DOTENV_CONFIG_PATH=../.env DEBUG=* $(yarn bin)/kosko generate --require dotenv/config -r module-alias/register --env prod "!(_*)"
```
