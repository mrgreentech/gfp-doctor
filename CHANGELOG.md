# CHANGELOG

### 1.6.0
* Add check for using prepush hooks and `husky` in package.json

### 1.5.0
* Add check for using `phantomjs-prebuilt` instead of `phantomjs`
* Add check for using `karma-phantomjs-launcher` version 1 and up in `package.json`

### 1.4.1
* Revert 1.3.2. Sometimes things go a bit too fast...

### 1.4.0
* Added check for having `npm run lint` script

### 1.3.2
* fix check for documentationjs in package.json

### 1.3.1
* Fixed parsing `eslintrc` as JSON ([PR 1](https://github.com/mrgreentech/gfp-doctor/pull/1) by [frebos88](https://github.com/frebos88))

### 1.3.0

Rule added:

1. `.eslintrc`
    1. Should use `require-jsdoc` rule

### 1.2.0

* Added examining bower.json

Rule added:

1. `bower.json`
    1. Should not have `"version"` property

## 1.1.0

* Added more rules
* Now writes if any rules have been skipped (could happen if failing to read file, for example)
* More emojis!

Rules added:

1. `package.json`
    1. Should use `eslint-config-gfp`
    1. Should use public npm version `angular-module-no-deps`
    1. Should use `documentation`
1. `.eslintrc`
    1. Should use `valid-jsdoc` rule
1. `karma.conf.js`
    1. Should use `angular` and `angular-mocks` from `node_modules`

## 1.0.0

* First version.
* One rule added: package.json should use public npm version of gfp eslint-config.
