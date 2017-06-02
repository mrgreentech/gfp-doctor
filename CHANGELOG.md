# CHANGELOG

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
