<h1 align="center">
  <img src="https://github.com/SocialGouv/helm-charts/raw/master/.github/boat.gif" width="250"/>
  <p align="center">Kosko Charts</p>
  <p align="center" style="font-size: 0.5em">🧹The Social Gouv Kosko Charts✨</p>
</h1>

<p align="center">
  <a href="https://github.com/SocialGouv/kosko-charts/workflows/main/"><img src="https://github.com/SocialGouv/kosko-charts/workflows/main/badge.svg" alt="Github Master Main Status"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache--2.0-yellow.svg" alt="License: Apache-2.0"></a>
  <a href="https://www.npmjs.com/package/@socialgouv/kosko-charts"><img src="https://img.shields.io/npm/v/@socialgouv/kosko-charts.svg" alt="Npm version"></a>
  <a href="https://codecov.io/gh/SocialGouv/kosko-charts"><img src="https://codecov.io/gh/SocialGouv/kosko-charts/branch/master/graph/badge.svg" alt="codecov"></a>
</p>

<br>
<br>
<br>
<br>

> [Kosko](https://github.com/tommy351/kosko) charts for the SocialGouv needs

## Problem

Providing a common Kubernetes (k8s) configuration to SocialGouv apps is a tricky task. We want to provide

- a "zero configuration" build, where most application will start from
- a Continuous delivery (CD) approach where each Git branches and tags should be deployed
- a [k8s namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) should be created per branches and tags. It should be GitLab friendly
- a basic k8s triad : [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Service](https://kubernetes.io/fr/docs/concepts/services-networking/service/), [Ingress](https://kubernetes.io/fr/docs/concepts/services-networking/ingress/)
- a [GitLab environments and deployments](https://docs.gitlab.com/ee/ci/environments/) and [clusters](https://docs.gitlab.com/ee/user/project/clusters/index.html#web-terminals) ready configuration
- a [Kubernetes Resource Report](https://github.com/hjacobs/kube-resource-report) friendly labelling
- a [kubed wildcard sync](https://appscode.com/products/kubed/0.9.0/guides/config-syncer/intra-cluster/)

<br>
<br>
<br>
<br>

## Solution

Powered by [Kosko](https://github.com/tommy351/kosko), in this lib we provide default SocialGouv components and environments. We expect project to use and extend them at will.

```sh
$ npx degit "SocialGouv/kosko-charts/templates/simple#v2.0.0-beta.17" .k8s
$ yarn --cwd .k8s
# on GitLab
$ yarn --cwd .k8s kosko generate --env dev
# locally
$ DOTENV_CONFIG_PATH=environments/.gitlab-ci.env yarn --cwd .k8s dev --require dotenv/config
```

<br>
<br>
<br>
<br>

## Installation

We use [degit](https://github.com/Rich-Harris/degit) to scaffold the deployment config.

```sh
$ npx degit "SocialGouv/kosko-charts/templates/simple#v2.0.0-beta.17" .k8s
```

`.k8s` is the target deployment config package folder.
You can install it with :

```sh
$ yarn --cwd .k8s
```

You can add a shortcut to it in your `package.json`

```js
{
  // [...]
  "scripts": {
    // [...]
    "k8s": "yarn --silent --cwd .k8s",
    // [...]
  }
  // [...]
}
```

The shortcut using `--silent` to be pipable to `kubectl apply` like :

```
$ yarn k8s generate | kubectl apply -f -
```

<br>
<br>
<br>
<br>

## Usage

### Components

The SocialGouv default components

#### [`@socialgouv/kosko-charts/components/app`](./src/components/app)

#### [`@socialgouv/kosko-charts/components/namespace`](./src/components/namespace)

### Environments

The SocialGouv default components

#### [`@socialgouv/kosko-charts/components/gitlab`](./src/components/gitlab)

<br>
<br>
<br>
<br>

## Inspiration

This package was inspired by the [kosko itself](https://github.com/tommy351/kosko/) and the year of experimentation with [Helm](https://helm.sh/) and our [SocialGouv/helm-charts](https://github.com/SocialGouv/helm-charts).

<br>
<br>
<br>
<br>

## [License Apache-2.0](./LICENSE)
