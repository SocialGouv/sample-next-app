# Gherkin | Codeceptjs | Puppeteer

## Install

```sh
# In this directory
$ yarn
```

## Usage

```sh
# Test the http://localhost:3000
$ yarn test
# alias to `yarn codeceptjs run --features`
```

By default the test will run in headless mode.  
If you what to see the browser define the `CODECEPT_HEADED` env variable.

```sh
$ export CODECEPT_HEADED=true
$ yarn test
```

You can change the tested URL by setting the CODECEPT_BASEURL

```sh
$ export CODECEPT_BASEURL=https://sample-next-app.fabrique.social.gouv.fr
# Test the https://sample-next-app.fabrique.social.gouv.fr
$ yarn test
```

## Debug

```sh
# To run one test in debug mode
$ yarn test --steps --verbose --grep "@apropos"
```

Another way to debug is by pausing the tests

```feature
@my_test
Fonctionnalité: Mon test

  Scénario:
    Soit un navigateur web sur le site
    Quand je pause le test
    Alors je vois "foo"
```

`Quand je pause le test` means that the browser will pause there

## Practices

We follow the following rules to write idiomatics tests

- Initial Situation use "Soit" or "Given"
- Actions use "Quand" or ("When"
- Assertions use "Alors" or "Then"

[Check Codecept documentation](https://codecept.io/advanced/#debug)
