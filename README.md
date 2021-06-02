<h1 align="center">@amndns/amqp-ts</h1>
<p align="center">

  <a href="https://badge.fury.io/js/%40amndns%2Famqp-ts">
    <img src="https://badge.fury.io/js/%40amndns%2Famqp-ts.svg" alt="npm version" height="18" target="_blank">
  </a>
  <a href="https://github.com/amndns/amqp-ts/blob/master/README.md" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/amndns/amqp-ts/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/amndns/amqp-ts/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" />
  </a>
</p>

> `@amndns/amqp-ts` is a class-based wrapper module for the original yet legacy `amqp-ts` library.

## ✨ Features

**Consumer**
- `class RabbitConsumer`
  - `function connect`
  - `function declareExchange`
  - `function declareQueue`
  - `function declareResources`
  - `function declareAdditionalResources`
  - `function run`

**Producer**
- `class RabbitProducer`
  - `function connect`
  - `function declareExchange`
  - `function publish`
- `decorator Producer`

**Utilities**
- `function consumerMessageTransformer`
- `function producerMessageTransformer`

**Types**
- `enum ContentType`
- `enum ExchangeType`
- `interface ExchangeOptions`
- `interface BaseConfig`
- `interface ConsumerConfig`
- `interface ProducerConfig`
- `interface MessageOptions`
- `type ConsumerCallback`

### Good for First Timers

- [ ] Add unit tests for the producer and consumer classes.
- [ ] Improve the channel disconnection logic of the producer class.

## 🚀 Get Started

This project was created using [TypeScript](https://www.typescriptlang.org/).

Below is a guide on the common commands you might use all throughout the development process. In the project directory, you can run:

#### `yarn install`

Installs all package dependencies of the app. Make sure you have [yarn](https://yarnpkg.com/) installed and configured first.

#### `yarn build-ts`

Transpiles all of the `.ts` files from the `src/` directory into `.js` CommonJS files. The target directory is in the `dist/` folder.

#### `yarn lint`

Launches the linter against all of the `.ts` files from the `src/` and `test/` directory. The project specifically uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) as the linter and code formatter, respectively.

#### `yarn test:unit`

Launches the test runner in interactive watch mode using Jest. The test is launched against all of the `.ts` files from the `test/` directory.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_