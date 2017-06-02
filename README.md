# gfp-doctor
A command-line tool to help identify problems with GFP modules

## Installation

```
npm install gfp-doctor -g
```

## Usage

```
$ gfp-doctor


Usage: gfp-doctor [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -v, --verbose
```

## Checks

1. `package.json`
    1. Should use `eslint-config-gfp`
    1. Should use public npm version of `eslint-config-gfp`
    1. Should use public npm version `angular-module-no-deps`
    1. Should use `documentation`
1. `.eslintrc`
    1. Should use `valqid-jsdoc` rule
1. `karma.conf.js`
    1. Should use `angular` and `angular-mocks` from `node_modules`
1. `bower.json`
    1. Should not have `"version"` property


## Contributing

Create a branch or fork, then submit PR.

Remember to:

* Update CHANGELOG.md
* Update README.md
* `npm run lint`

Please respect the `.editorconfig` and `.eslintrc`. Basically:

* UTF-8
* Unix linebreaks
* 4 space indentation
* Semicolons


### Adding new tests

1. Create a new file in `/lib` and require it in `lib/index.js`
2. The new file should return an array with the following format to the `run` function in `lib/index.js`:
```
[
    {
        desc: 'a description of the test being made',
        errorMsg: 'a descriptive error message and proposed solution',
        passed: Boolean
    },
    {...}
]
```
