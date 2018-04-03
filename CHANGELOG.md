# CHANGELOG

### 1.12.0

* Added npm packages to support babel/es6
* Added support for .babelrc configs.
* Separated all npm commands into properties called "run" to be copy paste friendly through the command line.
* Added 'npm uninstall' commands as well.
* Updated "styling" of failed tests in the commands line so they're more readable.
* Checks for version eslint-config-gfp@4.0.0
* Checks for only one .babelrc file

### 1.11.1

* Fixed missing line break.

### 1.11.0

* Replace `phantomjs` with `puppeteer`. While this could be considered a breaking change, the test code should mostly be the same and thus we consider this to be a minor.

### 1.10.1

* Don't allow value `latest` where `semver.ltr` is used as it causes exceptions
* Remove explicit domain name reference

### 1.10.0

* Added a check to make sure `gfp-doctor` is listed as a dev dependency and that it uses version 1.9 or higher.
* Adds version checks for `karma`, `karma-coverage` and `karma-jasmine`

### 1.9.0

* Fixes issue [#3](https://github.com/mrgreentech/gfp-doctor/issues/3) where `gfp-doctor` fails if `eslint-config-gfp` was set to `^3.0.1` in package.json. Now it rather fails if version is below 3.0.0.
* Added option `-s` (`--silent`) to suppress output.
* Added option `-pp` (`--package-path`) to override the default path to `package.json`.
* Made some changes in order to be able to require `doctor` as a CommonJS module.
* Doctor no longer crashes when it encounters invalid JSON in `.eslintrc` ([PR #3](https://github.com/mrgreentech/gfp-doctor/pull/4) by [frebos88](https://github.com/frebos88))

### 1.8.1

* Fixed typo from merge

### 1.8.0

* Add check for using eslint-config-gfp 3.0.0 and up
* Add check for having gfp-doctor run as a postinstall script ([PR #2](https://github.com/mrgreentech/gfp-doctor/pull/2) by [af-bergstrom](https://github.com/af-bergstrom))

### 1.7.0

* Add check for using public require-polyfill
* Now notifies if there are newer versions available

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

* Fixed parsing `eslintrc` as JSON ([PR #1](https://github.com/mrgreentech/gfp-doctor/pull/1) by [frebos88](https://github.com/frebos88))

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
