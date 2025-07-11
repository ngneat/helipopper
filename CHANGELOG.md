# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [11.1.3](https://github.com/ngneat/helipopper/compare/v11.1.2...v11.1.3) (2025-07-11)


### Refactor

* reduce RxJS overhead ([15fbf4d](https://github.com/ngneat/helipopper/commit/15fbf4dc10435f51407a0fd173ef3dfa99201d06))

### [11.1.2](https://github.com/ngneat/helipopper/compare/v11.1.1...v11.1.2) (2025-07-10)


### Refactor

* reduce RxJS overhead ([2d2ce67](https://github.com/ngneat/helipopper/commit/2d2ce6776370d3e34aac7d815a888c4f7d1ea7d3))

### [11.1.1](https://github.com/ngneat/helipopper/compare/v11.1.0...v11.1.1) (2025-07-04)


### Bug Fixes

* 🐛 use function in appendTo ([16a48bb](https://github.com/ngneat/helipopper/commit/16a48bb2db1f1b98c91efa364ca80d0c48659709))

## [11.1.0](https://github.com/ngneat/helipopper/compare/v11.0.0...v11.1.0) (2025-07-03)


### Features

* 🎸 support fullscreenElement when active ([a59695d](https://github.com/ngneat/helipopper/commit/a59695d5c0d0f983c23453219e00e8a431bc2f34))

## [11.0.0](https://github.com/ngneat/helipopper/compare/v10.2.1...v11.0.0) (2025-06-30)


### ⚠ BREAKING CHANGES

* visible output is no longer an observable. use outputToObservable if you
need

### Bug Fixes

* 🐛 create tippy when changing from empty to content ([247d13c](https://github.com/ngneat/helipopper/commit/247d13c7bd0c8696353e8e7c6dd448f52d94c1d9)), closes [#138](https://github.com/ngneat/helipopper/issues/138)

### [10.2.1](https://github.com/ngneat/helipopper/compare/v10.2.0...v10.2.1) (2025-05-27)


### Bug Fixes

* onHide emit only if ref is not destroyed ([300c4f0](https://github.com/ngneat/helipopper/commit/300c4f0c05536f44ae4e7b78396e98753f9192ca))

## [10.2.0](https://github.com/ngneat/helipopper/compare/v9.2.1...v10.2.0) (2025-05-25)


### Features

* add `@ngneat/helipopper/config` ([fe59df7](https://github.com/ngneat/helipopper/commit/fe59df74269e8ee59d8328a48672783256c16761))
* allow lazy-loading `tippy.js` ([3913322](https://github.com/ngneat/helipopper/commit/3913322b43f7b23f4ebd51df93bf2dd306e7e169))
* expose onShow and onHide from tippyJS ([05ef2ee](https://github.com/ngneat/helipopper/commit/05ef2eee5f68122a690a132789e1c782f7d24ffd))
* switch to signal inputs ([a7b6512](https://github.com/ngneat/helipopper/commit/a7b6512ea91fd4a767c7751a19b77b9482e59703))
* upgrade to Angular 19 ([d33b7b2](https://github.com/ngneat/helipopper/commit/d33b7b284c2808aab15667a7759ff4e299454894))


### Bug Fixes

* do not update `isVisible` signal when view is destroyed ([7c43af9](https://github.com/ngneat/helipopper/commit/7c43af98599463a18858354fb31d33572d1dee9b))
* enable strict mode ([419bf97](https://github.com/ngneat/helipopper/commit/419bf97219281cf77e824c167d1bea3bd1a11cc6))
* watch `isEnabled` changes ([c8e1a4f](https://github.com/ngneat/helipopper/commit/c8e1a4f35ebe7fc9207ffbc6372cf4a4d3613259))

### [10.2.0-alpha.2](https://github.com/ngneat/helipopper/compare/v10.2.0-alpha.1...v10.2.0-alpha.2)(2025-01-03)


### Refactor

* do not export config entry and do some cleanups ([aed43fc](https://github.com/ngneat/helipopper/commit/aed43fc177bfc2d9864a157de70e18ae562d2505))

### [10.2.0-alpha.1](https://github.com/ngneat/helipopper/compare/v10.2.0-alpha.0...v10.2.0-alpha.1)(2025-01-01)


### Refactor

* tree-shake injection token names ([ff51f57](https://github.com/ngneat/helipopper/commit/ff51f5759787ffbe0dc6cbe7291b71ffe0c81c31))

### [10.2.0-alpha.0](https://github.com/ngneat/helipopper/compare/v10.1.0-alpha.0...v10.2.0-alpha.0)(2024-12-07)


### Features

* upgrade to Angular 19 ([d33b7b2](https://github.com/ngneat/helipopper/commit/d33b7b284c2808aab15667a7759ff4e299454894))


### Fixes

* do not update `isVisible` signal when view is destroyed ([7c43af9](https://github.com/ngneat/helipopper/commit/7c43af98599463a18858354fb31d33572d1dee9b))

### [10.1.0-alpha.0](https://github.com/ngneat/helipopper/compare/v10.0.0-alpha.1...v10.1.0-alpha.0)(2024-11-20)


### Features

* add `@ngneat/helipopper/config` ([fe59df7](https://github.com/ngneat/helipopper/commit/fe59df74269e8ee59d8328a48672783256c16761))

### [10.0.0-alpha.1](https://github.com/ngneat/helipopper/compare/v10.0.0-alpha.0...v10.0.0-alpha.1) (2024-11-17)


### Fixes

* enable strict mode ([419bf97](https://github.com/ngneat/helipopper/commit/419bf97219281cf77e824c167d1bea3bd1a11cc6))

### [10.0.0-alpha.0](https://github.com/ngneat/helipopper/compare/v9.2.1...v10.0.0-alpha.0) (2024-11-17)


### ⚠ BREAKING CHANGES

* `tippy.js` must be explicitly passed to the loader function when calling `provideTippyConfig` (see README).

### Features

* allow lazy-loading `tippy.js` ([74a3ed6](https://github.com/ngneat/helipopper/commit/74a3ed6bffd66035cbcf7d90726420ef2a847452))
* switch to signal inputs ([e698cca](https://github.com/ngneat/helipopper/commit/e698ccad53c3de4c285faae484602cf10eaa96a9))

### [9.2.1](https://github.com/ngneat/helipopper/compare/v9.2.0...v9.2.1) (2023-12-13)


### Bug Fixes

* 🐛 allow injector also in service creation ([cb3e6ef](https://github.com/ngneat/helipopper/commit/cb3e6efc823a16f4a59af32472f867b12805aa99))

## [9.2.0](https://github.com/ngneat/helipopper/compare/v9.1.0...v9.2.0) (2023-12-13)


### Features

* 🎸 introduce injectTippyRef ([129b91a](https://github.com/ngneat/helipopper/commit/129b91aec9f10d134cb8ed66c0bbae742800d205))

## [9.1.0](https://github.com/ngneat/helipopper/compare/v9.0.0...v9.1.0) (2023-12-11)


### Features

* 🎸 use transform on boolean inputs ([0eec969](https://github.com/ngneat/helipopper/commit/0eec969e2e4c823d4e93836116aeff8c9982fdaa))

## [9.0.0](https://github.com/ngneat/helipopper/compare/v8.0.3...v9.0.0) (2023-11-28)


### ⚠ BREAKING CHANGES

* peer deps of the library and overview are v17

### Features

* 🎸 update to ng17 ([65f4c76](https://github.com/ngneat/helipopper/commit/65f4c768d5359ea78ec98406027d82737e502009))
* 🎸 use makeEnvironmentProviders for config ([e629cb2](https://github.com/ngneat/helipopper/commit/e629cb2f3d47ffd2fd5faabf5f8caa2426987617))

### [8.0.3](https://github.com/ngneat/helipopper/compare/v8.0.2...v8.0.3) (2023-09-05)


### Bug Fixes

* 🐛 handle content changes with overflow ([ef3264b](https://github.com/ngneat/helipopper/commit/ef3264b67e1cd8663e4384e70382b940c636ff71))

### [8.0.2](https://github.com/ngneat/helipopper/compare/v8.0.1...v8.0.2) (2023-07-24)


### Bug Fixes

* 🐛 move deps from peer to deps ([05579e0](https://github.com/ngneat/helipopper/commit/05579e0cd2b6102a508668781931551d0feca5c4)), closes [#143](https://github.com/ngneat/helipopper/issues/143)

### [8.0.1](https://github.com/ngneat/helipopper/compare/v8.0.0...v8.0.1) (2023-07-16)


### Bug Fixes

* 🐛 ssr ([26169f1](https://github.com/ngneat/helipopper/commit/26169f139ab462bceeb2b916b6c5803a5b3a7f54)), closes [#142](https://github.com/ngneat/helipopper/issues/142)

## [8.0.0](https://github.com/ngneat/helipopper/compare/v7.1.1...v8.0.0) (2023-07-09)


### ⚠ BREAKING CHANGES

* peer dependency is now angular v16+

### Features

* 🎸 support host visibility observer ([5907e34](https://github.com/ngneat/helipopper/commit/5907e344d80bfc86b2bf1f1ddffc80b3637d5f4a))


* 🤖 update to angular v16 ([04e9fbb](https://github.com/ngneat/helipopper/commit/04e9fbb655867c0a29ee965712d581c542a7d5c8))

### [7.1.1](https://github.com/ngneat/helipopper/compare/v7.1.0...v7.1.1) (2023-04-24)


### Bug Fixes

* 🐛 remove warning ([42c7d47](https://github.com/ngneat/helipopper/commit/42c7d472bfc5341e8d137cc1d8225546242603fb))

## [7.1.0](https://github.com/ngneat/helipopper/compare/v7.0.2...v7.1.0) (2023-04-24)


### Features

* 🎸 add global get index ([2c29cd4](https://github.com/ngneat/helipopper/commit/2c29cd4736198649b0dfb826f2f04be8130b7810))

### [7.0.2](https://github.com/ngneat/helipopper/compare/v7.0.1...v7.0.2) (2023-03-15)


### Bug Fixes

* 🐛 remove tippy warning when using isLazy ([33cb300](https://github.com/ngneat/helipopper/commit/33cb300d68e4432cc46715a26cf255a1530713eb)), closes [#134](https://github.com/ngneat/helipopper/issues/134)

### [7.0.1](https://github.com/ngneat/helipopper/compare/v7.0.0...v7.0.1) (2023-03-09)


### Bug Fixes

* 🐛 template type checking ([66a0f82](https://github.com/ngneat/helipopper/commit/66a0f82a4286e85f62bdeaebf92dee5728124c9d))

## [7.0.0](https://github.com/ngneat/helipopper/compare/v6.6.0...v7.0.0) (2023-03-09)


### ⚠ BREAKING CHANGES

* Rename `tippy` to `tp`
* Prefix all inputs with `tp`
* Rename `lazy` input to `tpIsLazy`

You can find a script that will help you migrate [here](https://github.com/ngneat/helipopper/blob/master/migrations/v7-migration.md).

### refactor

* 💡 Rename directive inputs ([cc1a5a6](https://github.com/ngneat/helipopper/commit/cc1a5a6efce8c24f355d217ab1663e841a41a1d5))

## [6.6.0](https://github.com/ngneat/helipopper/compare/v6.5.2...v6.6.0) (2023-02-26)


### Features

* make tippy directive extendable ([e94a27c](https://github.com/ngneat/helipopper/commit/e94a27c6c5d69772cde5cd8beaead02f25feb59f))


### Bug Fixes

* do not trigger change detection for `visible` and `keydown` events ([39c69c3](https://github.com/ngneat/helipopper/commit/39c69c3a6e0564b649b96782171c81d58b07cdcd))

### [6.5.2](https://github.com/ngneat/helipopper/compare/v6.5.1...v6.5.2) (2023-02-04)

### [6.5.1](https://github.com/ngneat/helipopper/compare/v6.5.0...v6.5.1) (2023-01-28)


### Bug Fixes

* 🐛 update overview dep ([ccfd6cb](https://github.com/ngneat/helipopper/commit/ccfd6cb93876cf1f3b562489cd5e56da08f3bbdf)), closes [#123](https://github.com/ngneat/helipopper/issues/123)

## [6.5.0](https://github.com/ngneat/helipopper/compare/v6.3.0...v6.5.0) (2023-01-16)


### Features

* 🎸 add text content option ([be9c114](https://github.com/ngneat/helipopper/commit/be9c114840afaebb7ece8adecc0d1cc040481ce1))
* 🎸 allow nil content ([bff69ef](https://github.com/ngneat/helipopper/commit/bff69efa3b7505c1ce745573a0c4c67066953a41))
* 🎸 expose width input ([0412cf9](https://github.com/ngneat/helipopper/commit/0412cf9bfa99dc2d0461faf325dfaefb8121086b))

## [6.4.0](https://github.com/ngneat/helipopper/compare/v6.3.0...v6.4.0) (2023-01-10)


### Features

* 🎸 expose width input ([0412cf9](https://github.com/ngneat/helipopper/commit/0412cf9bfa99dc2d0461faf325dfaefb8121086b))

## [6.3.0](https://github.com/ngneat/helipopper/compare/v6.2.2...v6.3.0) (2023-01-05)


### Features

* 🎸 expose animation input ([8cfcb35](https://github.com/ngneat/helipopper/commit/8cfcb35a9cebf38616df741312d910c9bceba337))

### [6.2.2](https://github.com/ngneat/helipopper/compare/v6.2.1...v6.2.2) (2023-01-05)


### Bug Fixes

* 🐛 fix reference ([f0c8abc](https://github.com/ngneat/helipopper/commit/f0c8abc90fb5b2424f15530c4bca054208bae3c3))

### [6.2.1](https://github.com/ngneat/helipopper/compare/v6.2.0...v6.2.1) (2023-01-05)


### Bug Fixes

* 🐛 move data open to a better hool ([6e68832](https://github.com/ngneat/helipopper/commit/6e68832cdf79ede08ddf47c2e740c8c3bbbd6af9))

## [6.2.0](https://github.com/ngneat/helipopper/compare/v6.1.0...v6.2.0) (2022-12-28)


### Features

* 🎸 add data-tippy-open attribute on the host ([0ea15c4](https://github.com/ngneat/helipopper/commit/0ea15c45e9b06af20925b2515bead39b576ad12e))

## [6.1.0](https://github.com/ngneat/helipopper/compare/v6.0.0...v6.1.0) (2022-12-26)


### Features

* 🎸 add variation class ([c82f4b8](https://github.com/ngneat/helipopper/commit/c82f4b8f007b462b062f06f918cc15c38fc6189c))

## [6.0.0](https://github.com/ngneat/helipopper/compare/v5.1.4...v6.0.0) (2022-11-27)


### ⚠ BREAKING CHANGES

* upgrade to Angular 15

- Remove `TippyModule`
- Peer dependency is now ng v15

### Features

* upgrade to Angular 15 ([e040211](https://github.com/ngneat/helipopper/commit/e04021193f063d5a3bd33334a579f2a130902f55))

### [5.1.4](https://github.com/ngneat/helipopper/compare/v5.1.3...v5.1.4) (2022-02-04)


### Bug Fixes

* 🐛 isVisible should run inside the zone ([96128c2](https://github.com/ngneat/helipopper/commit/96128c2e5ee1893b9ce4795943df089ceb5779ee))

### [5.1.3](https://github.com/ngneat/helipopper/compare/v5.1.2...v5.1.3) (2022-02-04)


### Bug Fixes

* 🐛 isVisible should run inside the zone ([90901de](https://github.com/ngneat/helipopper/commit/90901de286307d7ba2e18e9fc68b82b5d86779f8))

### [5.1.2](https://github.com/ngneat/helipopper/compare/v5.1.1...v5.1.2) (2022-01-31)


### Bug Fixes

* 🐛 support onpush components ([6bb9097](https://github.com/ngneat/helipopper/commit/6bb9097dca69f70245d1995220c9a253c6e233ff))

### [5.1.1](https://github.com/ngneat/helipopper/compare/v5.1.0...v5.1.1) (2021-12-29)


### Bug Fixes

* 🐛 filter out custom props ([d15f38b](https://github.com/ngneat/helipopper/commit/d15f38ba3dd5e3c4bc18fd3a722bbf9d84f65984))

## [5.1.0](https://github.com/ngneat/helipopper/compare/v5.0.2...v5.1.0) (2021-12-23)


### Features

* 🎸 preserve view when creating tooltip via service ([d497bd4](https://github.com/ngneat/helipopper/commit/d497bd4d13e28313b9dcb345bff461d9ebaafd89))

### [5.0.2](https://github.com/ngneat/helipopper/compare/v5.0.1...v5.0.2) (2021-11-25)


### Bug Fixes

* 🐛 dont create tippy on server side ([2dbf2c4](https://github.com/ngneat/helipopper/commit/2dbf2c424461300c2399c88b74b169387dbf4a12)), closes [#77](https://github.com/ngneat/helipopper/issues/77)

### [5.0.1](https://github.com/ngneat/helipopper/compare/v5.0.0...v5.0.1) (2021-11-25)


### Bug Fixes

* update only modified properties on change ([0345b52](https://github.com/ngneat/helipopper/commit/0345b526aeffae9b2dee567e1fa6847557b92994))

## [5.0.0](https://github.com/ngneat/helipopper/compare/v4.3.0...v5.0.0) (2021-11-24)


### ⚠ BREAKING CHANGES

* Peer dep of angular 13

### Features

* 🎸 upgrade to ng13 ([0736821](https://github.com/ngneat/helipopper/commit/07368217c22bebb4cffd63a1353f390177312bd0))

## [4.3.0](https://github.com/ngneat/helipopper/compare/v4.2.0...v4.3.0) (2021-11-23)


### Features

* pass data to custom component ([53224d1](https://github.com/ngneat/helipopper/commit/53224d13b9a5fa0063341d8808509ad5a72fe997)), closes [#74](https://github.com/ngneat/helipopper/issues/74)


### Bug Fixes

* add context to ownProps to remove from tippy config ([c096ef2](https://github.com/ngneat/helipopper/commit/c096ef23d125ddfb0f964d296249384d63dbc918))

## [4.2.0](https://github.com/ngneat/helipopper/compare/v4.1.1...v4.2.0) (2021-08-09)


### Features

* 🎸 allow passing context to component ([e342668](https://github.com/ngneat/helipopper/commit/e3426680e736facf9f8313e6c6c3e2ba1c1a4358))

### [4.1.1](https://github.com/ngneat/helipopper/compare/v4.1.0...v4.1.1) (2021-07-23)


### Bug Fixes

* 🐛 check duplicate component ([2263bed](https://github.com/ngneat/helipopper/commit/2263bed741797fc413f47970c17185c7dafc7a8e)), closes [#65](https://github.com/ngneat/helipopper/issues/65)

## [4.1.0](https://github.com/ngneat/helipopper/compare/v4.0.2...v4.1.0) (2021-07-18)


### Features

* declarativly toggle visibility ([e9f0e89](https://github.com/ngneat/helipopper/commit/e9f0e89174da74f01768ab1643bfb63d41690c90))

### [4.0.2](https://github.com/ngneat/helipopper/compare/v4.0.1...v4.0.2) (2021-07-16)


### Bug Fixes

* 🐛 fix context option ([9bb9ddb](https://github.com/ngneat/helipopper/commit/9bb9ddb05143b9aada9901db343882c44116daf7)), closes [#63](https://github.com/ngneat/helipopper/issues/63)

### [4.0.1](https://github.com/ngneat/helipopper/compare/v4.0.0...v4.0.1) (2021-07-15)


### Bug Fixes

* 🐛 revert custom host ([a5e72d6](https://github.com/ngneat/helipopper/commit/a5e72d69336bd32802d3cf2827e60c0e303da437))

## [4.0.0](https://github.com/ngneat/helipopper/compare/v3.7.1...v4.0.0) (2021-07-15)


### ⚠ BREAKING CHANGES

* When providing a string as content, we use innertext instead to prevent
xss

### Features

* 🎸 don't use innerhtml when passing a string ([cb4f2f7](https://github.com/ngneat/helipopper/commit/cb4f2f72d67a83217a4c67fc3e280b3e5add2a96))

### [3.7.1](https://github.com/ngneat/helipopper/compare/v3.7.0...v3.7.1) (2021-07-11)


### Bug Fixes

* correct instance to run showOnCreate  (test) ([a3e5dc8](https://github.com/ngneat/helipopper/commit/a3e5dc84c8afe933610b63e05b2fb9bb1d48dbb6))
* correct instance to run showOnCreate correct ([976ec37](https://github.com/ngneat/helipopper/commit/976ec376296c31ba759add8978564d52594ba184))

## [3.6.0](https://github.com/ngneat/helipopper/compare/v3.5.3...v3.6.0) (2021-06-30)


### Features

* 🎸 ng add support v12 ([4e07bec](https://github.com/ngneat/helipopper/commit/4e07bec2352dc1385ff27650f1b79759c8b48aba)), closes [#55](https://github.com/ngneat/helipopper/issues/55)

### [3.5.3](https://github.com/ngneat/helipopper/compare/v3.5.2...v3.5.3) (2021-06-07)

### [3.5.2](https://github.com/ngneat/helipopper/compare/v3.5.1...v3.5.2) (2021-06-07)


### Bug Fixes

* 🐛 filter invalid class names ([987082b](https://github.com/ngneat/helipopper/commit/987082bd88b6dbe64d6eeb86fd14cbd7f1c06fc3))

### [3.5.1](https://github.com/ngneat/helipopper/compare/v3.5.0...v3.5.1) (2021-06-07)


### Bug Fixes

* 🐛 support multipule class names in service ([9a7fd8e](https://github.com/ngneat/helipopper/commit/9a7fd8e82c20ad1493ea38df755ba0f2f988d473))

## [3.5.0](https://github.com/ngneat/helipopper/compare/v3.4.0...v3.5.0) (2021-06-07)


### Features

* 🎸 support multiple class names ([3f6724c](https://github.com/ngneat/helipopper/commit/3f6724c4e3f62bc170dd7b059a6067b4b2e5886e))
* add hideOnEscapeButton to close popper ([dab90fc](https://github.com/ngneat/helipopper/commit/dab90fcbf860742295b1ac7b3b11d68a1c34cbea))

## [3.4.0](https://github.com/ngneat/helipopper/compare/v3.2.1...v3.4.0) (2021-06-06)


### Features

* added config 'disableOnNilValue' to disable tippy if value is nil ([3a27fa0](https://github.com/ngneat/helipopper/commit/3a27fa08916b45c582b10d31c70e0a1feaf50351))
* added config 'disableOnNilValue' to skip instance if value is nil ([8c14a5e](https://github.com/ngneat/helipopper/commit/8c14a5ed98ff2d286e3c7981f3de1b2bb28313f7))
* only create tippy instance in case of non-nil value ([f712880](https://github.com/ngneat/helipopper/commit/f712880cacf2bd9e09db9ff9e46f39c5641069f1))
* only create tippy instance in case of non-nil value ([06b8d7d](https://github.com/ngneat/helipopper/commit/06b8d7da5fd38205df78cb2625a23ca261c92ca0))
* removed config 'disableOnNilValue' in favour of default behaviour ([8bfd4b6](https://github.com/ngneat/helipopper/commit/8bfd4b6eaabb55b651832978b608938e32d2e814))

## [3.3.0](https://github.com/ngneat/helipopper/compare/v3.2.1...v3.3.0) (2021-06-06)


### Features

* added config 'disableOnNilValue' to disable tippy if value is nil ([3a27fa0](https://github.com/ngneat/helipopper/commit/3a27fa08916b45c582b10d31c70e0a1feaf50351))
* added config 'disableOnNilValue' to skip instance if value is nil ([8c14a5e](https://github.com/ngneat/helipopper/commit/8c14a5ed98ff2d286e3c7981f3de1b2bb28313f7))
* only create tippy instance in case of non-nil value ([f712880](https://github.com/ngneat/helipopper/commit/f712880cacf2bd9e09db9ff9e46f39c5641069f1))
* only create tippy instance in case of non-nil value ([06b8d7d](https://github.com/ngneat/helipopper/commit/06b8d7da5fd38205df78cb2625a23ca261c92ca0))
* removed config 'disableOnNilValue' in favour of default behaviour ([8bfd4b6](https://github.com/ngneat/helipopper/commit/8bfd4b6eaabb55b651832978b608938e32d2e814))

### [3.2.1](https://github.com/ngneat/helipopper/compare/v3.2.0...v3.2.1) (2021-05-24)


### Bug Fixes

* 🐛 fix nullish check ([59d17db](https://github.com/ngneat/helipopper/commit/59d17dbfc09d19afd1a591f8dc543c6298402a52))

## [3.2.0](https://github.com/ngneat/helipopper/compare/v3.1.1...v3.2.0) (2021-05-24)


### Features

* 🎸 support class name property when using the service ([0a8218b](https://github.com/ngneat/helipopper/commit/0a8218b6ae10b6a9102fab523f329f62c2b22dfa))

### [3.1.1](https://github.com/ngneat/helipopper/compare/v3.1.0...v3.1.1) (2021-03-14)


### Bug Fixes

* 🐛 add maxwidth to child element ([fbbd4cc](https://github.com/ngneat/helipopper/commit/fbbd4ccd148efbc721fa416c3654c30af6851a25))

## [3.1.0](https://github.com/ngneat/helipopper/compare/v3.0.0...v3.1.0) (2021-02-08)


### Features

* add ngneat/overview to package.json by schematics ([54d0998](https://github.com/ngneat/helipopper/commit/54d0998a65e346aa30e90b104b57562f3d69b275))

## [3.0.0](https://github.com/ngneat/helipopper/compare/v2.1.1...v3.0.0) (2021-01-28)


### ⚠ BREAKING CHANGES

* ngneat/overview is external dep

### Features

* 🎸 remove ngneat overview from deps ([ea8212e](https://github.com/ngneat/helipopper/commit/ea8212ef56156db574d8e404447830a6d9f81125))

### [2.1.1](https://github.com/ngneat/helipopper/compare/v2.1.0...v2.1.1) (2021-01-05)


### Bug Fixes

* 🐛 listen to host resize when using host width ([dfb9b45](https://github.com/ngneat/helipopper/commit/dfb9b457ffe7f2eb0d3e5960124c79b85fd8bd52))

## [2.1.0](https://github.com/ngneat/helipopper/compare/v2.0.0...v2.1.0) (2020-12-30)


### Bug Fixes

* 🐛 fix variation and warnings ([c6eec8b](https://github.com/ngneat/helipopper/commit/c6eec8bf268a1b0d2211a66f9a8d9e078cbeb349))


### Tests

* 💍 fix ([f68c0b5](https://github.com/ngneat/helipopper/commit/f68c0b5378c4133ae9949c1d5d2f2dedff307a2c))
* 💍 remove redundant spec ([d337a3c](https://github.com/ngneat/helipopper/commit/d337a3cba56e13804dea0f20a1c3cff0d83a39ae))

## [1.6.0](https://github.com/ngneat/helipopper/compare/v1.5.5...v1.6.0) (2020-12-22)


### Features

* 🎸 add use host width property ([922ce01](https://github.com/ngneat/helipopper/commit/922ce0163984a16ccc202e3faab3eb3da68a1815))

## [2.0.0](https://github.com/ngneat/helipopper/compare/v1.5.5...v2.0.0) (2020-12-29)


### ⚠ BREAKING CHANGES

* the api is simpler now checkout the readme

### Features

* 🎸 add context menu ([88fbf4b](https://github.com/ngneat/helipopper/commit/88fbf4b48e9e3d5942094aba0f592cff184f2773))
* 🎸 add host width option ([b412793](https://github.com/ngneat/helipopper/commit/b4127939270038c3d0feb7a9fdd19c6da2a85558))
* 🎸 add use host width input ([64bc855](https://github.com/ngneat/helipopper/commit/64bc85593c54e7811a2fe5a001029ac0f523755f))
* 🎸 export inview and dimchanges ([6349609](https://github.com/ngneat/helipopper/commit/634960970b143a9390393310cf1690be04247ea6))
* 🎸 release v2 ([c42d94e](https://github.com/ngneat/helipopper/commit/c42d94e377aabcaf8bb4b7e8334b50e431cbc8a0))
* 🎸 version two ([ac44bb6](https://github.com/ngneat/helipopper/commit/ac44bb6f7aaf8c66338a2e2bbbeb47c59b9a15c7))


### Tests

* 💍 fix tests ([bbfacee](https://github.com/ngneat/helipopper/commit/bbfacee9d1ba36bd8b35b316ce8dfe14228ac5be))

### [1.5.5](https://github.com/ngneat/helipopper/compare/v1.5.4...v1.5.5) (2020-11-28)


### Bug Fixes

* specify module type in `ModuleWithProviders` ([cef0703](https://github.com/ngneat/helipopper/commit/cef07031a121f4f40247f4eb29a152ee12d63896))

### [1.5.4](https://github.com/ngneat/helipopper/compare/v1.5.3...v1.5.4) (2020-11-22)


### Bug Fixes

* 🐛 several intersection events on the same tick ([6eab305](https://github.com/ngneat/helipopper/commit/6eab3056b5960a549932ac5cea0aff9fa1e1035f))

### [1.5.3](https://github.com/ngneat/helipopper/compare/v1.5.2...v1.5.3) (2020-11-20)


### Bug Fixes

* 🐛 reset tooltip on content change ([5a53e16](https://github.com/ngneat/helipopper/commit/5a53e1694af8be292e0ddf2b62e7341a9236808d))

### [1.5.2](https://github.com/ngneat/helipopper/compare/v1.5.1...v1.5.2) (2020-11-18)


### Bug Fixes

* 🐛 fix leak ([0d35e3e](https://github.com/ngneat/helipopper/commit/0d35e3e185dd25e82d2f9fe3a5641812a9cec5da))

### [1.5.1](https://github.com/ngneat/helipopper/compare/v1.5.0...v1.5.1) (2020-11-16)


### Bug Fixes

* allow `<ng-container>` and multiple child nodes ([e648877](https://github.com/ngneat/helipopper/commit/e64887761126acee7cae723a8778e595a133db0f))
* allow `<ng-container>` and multiple child nodes ([e2b666b](https://github.com/ngneat/helipopper/commit/e2b666b3b6158d735e616bf6e4ead57e3c53d016))
* support server-side rendering ([2602c3d](https://github.com/ngneat/helipopper/commit/2602c3df2fd3beb23e9e35c0d7a59f76ab715ac1))


### Tests

* fix Cypress tests related to scrolling ([743f1f8](https://github.com/ngneat/helipopper/commit/743f1f8801bd80b04300790b5532ea55e58e88ba))

## [1.5.0](https://github.com/ngneat/helipopper/compare/v1.4.1...v1.5.0) (2020-11-12)


### Features

* 🎸 add maxwidth input ([1361d2b](https://github.com/ngneat/helipopper/commit/1361d2bdd2c0f8b16676950f1217c94b9d7639f6))

### [1.4.1](https://github.com/ngneat/helipopper/compare/v1.4.0...v1.4.1) (2020-11-11)


### Bug Fixes

* 🐛 use animation frame ([d1cb240](https://github.com/ngneat/helipopper/commit/d1cb240417dec08825c8733e45e250ba50c28280))

## [1.4.0](https://github.com/ngneat/helipopper/compare/v1.3.2...v1.4.0) (2020-09-22)


### Features

* **doc:** add new table to manage Outputs ([25d0778](https://github.com/ngneat/helipopper/commit/25d077838ddffe0bdba3bd3d8be61ad5a0b52083))
* **lib:** update Subject name into "helipopperVisible" ([3744d91](https://github.com/ngneat/helipopper/commit/3744d91d4288325f78609681fa04a5635c4e200b))
* add [@output](https://github.com/output)() method to expose current tooltip status as boolean ([409ad7f](https://github.com/ngneat/helipopper/commit/409ad7f4b4074e907c4858cdd5a177dec913b8a8))

### [1.3.2](https://github.com/ngneat/helipopper/compare/v1.3.1...v1.3.2) (2020-08-30)


### Bug Fixes

* 🐛 fix options ([3a3f1e7](https://github.com/ngneat/helipopper/commit/3a3f1e73f654bee7d3c5e79ad6388cf7e712a4f9))

### [1.3.1](https://github.com/ngneat/helipopper/compare/v1.3.0...v1.3.1) (2020-08-30)


### Bug Fixes

* 🐛 fix options ([a5b6069](https://github.com/ngneat/helipopper/commit/a5b606997d97b4fa64993704b894656ab65b01a4))

## [1.3.0](https://github.com/ngneat/helipopper/compare/v1.2.0...v1.3.0) (2020-08-30)


### Features

* 🎸 add allow close input ([236a9dc](https://github.com/ngneat/helipopper/commit/236a9dce2646d5ad3bb887adc0a5c53bbc5bedcf))

## [1.2.0](https://github.com/ngneat/helipopper/compare/v1.1.0...v1.2.0) (2020-08-30)


### Features

* **demo:** add dynamic example ([8afc175](https://github.com/ngneat/helipopper/commit/8afc1757823c2638e9268dcb3ac4e785c9097df8))
* **demo:** add dynamic example ([d3bd06a](https://github.com/ngneat/helipopper/commit/d3bd06a38dc0432213a4a920e29c9bf02a148e59))
* **lib:** add initial options ([f7fb020](https://github.com/ngneat/helipopper/commit/f7fb0201ca82e4b8e302910e23efb5dce2f8bd5e))
* **lib:** add popper API ([18a8334](https://github.com/ngneat/helipopper/commit/18a83341cf90acd8aad5dbff823e86e0cf3020db))
* **lib:** add popper API ([d6857ea](https://github.com/ngneat/helipopper/commit/d6857eaf4277564f123dd6e95d3c6eddf24c4c70))
* **lib:** add popper API demo ([76cbb13](https://github.com/ngneat/helipopper/commit/76cbb1361176b41e2d0fc2b59e415a08641341c8))


### Bug Fixes

* **schematics:** library name ([35c4f32](https://github.com/ngneat/helipopper/commit/35c4f323cf11569049eb2374ebedbd54c44bf698))

## [1.1.0](https://github.com/ngneat/helipopper/compare/v1.0.0...v1.1.0) (2020-06-15)


### Features

* 🎸 add schematics ([93a2b83](https://github.com/ngneat/helipopper/commit/93a2b83aad38f244c7bc4a0fcba8d1d3f1bdcbdb))
* 🎸 add schematics ([59509a3](https://github.com/ngneat/helipopper/commit/59509a3c745233e41d4a89da6e666e58c38991c8))
* 🎸 add support for component ([5438d4f](https://github.com/ngneat/helipopper/commit/5438d4f7eab7b2467b8176aef2cd523dda7ba104))

## 1.0.0 (2020-06-12)
