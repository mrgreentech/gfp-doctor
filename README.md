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

## Contributing

Please respect the `.editorconfig` and `.eslintrc`. Basically:

* UTF-8
* Unix linebreaks
* 4 space indentation
* Semicolons

Run:
```
npm run lint
```

Run tests:

```
npm test
```

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
