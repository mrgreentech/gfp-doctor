const log = require('loglevel');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
const addSkipped = require('./rules-util.js').addSkipped;
const processRules = require('./rules-util.js').processRules;
const semver = require('semver');

const rulesConf = {
    name: 'package.json',
    rules: [
        {
            desc: 'using public npm version of gfp eslint config',
            errorMsg:
                'remove "gfp-eslint-config" from package.json and install "eslint eslint-config-gfp" instead, or just run:',
            run:
                'npm uninstall --save-dev gfp-eslint-config && npm install --save-dev eslint eslint-config-gfp',
            fn: notUsingStashGfpEslintConfig
        },
        {
            desc: 'using eslint-config-gfp',
            errorMsg: 'Run:',
            run: 'npm install --save-dev eslint-config-gfp',
            fn: missingEslintConfigGfp
        },
        {
            desc: 'using public npm version of angular-module-no-deps',
            errorMsg:
                'remove "angular-module-no-deps" from package.json and install "angular-module-no-deps" instead, or just run:',
            run:
                'npm uninstall --save-dev angular-module-no-deps && npm install --save-dev angular-module-no-deps',
            fn: notUsingStashAngularModuleNoDeps
        },
        {
            desc: 'using documentationjs',
            errorMsg:
                'should be using documentationjs to generate JSDoc to README:\n' +
                'add scripts: \n' +
                '"docs": "npm run docs:md",\n' +
                '"docs:md": "documentation readme <source files>.js --section \'API\'"\n' +
                '"and run:',
            run: 'npm install --save-dev documentation',
            fn: usingDocumentationJs
        },
        {
            desc: 'has npm script lint',
            errorMsg:
                'should have a npm script lint\n' +
                'then add script to package.json: \n' +
                '"lint": "eslint *.js"',
            fn: hasNpmLintScript
        },
        {
            desc: 'should be using babel-cli',
            errorMsg: 'Run:',
            run: 'npm install --save-dev babel-cli@6.22.2',
            fn: shouldUseBabelCli
        },
        {
            desc: 'should be using babel-core',
            errorMsg: 'Run:',
            run: 'npm install --save-dev babel-core@6.22.1',
            fn: shouldUseBabelCore
        },
        {
            desc: 'should be using babel-loader',
            errorMsg: 'Run:',
            run: 'npm install --save-dev babel-loader@6.2.10',
            fn: shouldUseBabelLoader
        },
        {
            desc: 'should be using babel-plugin-istanbul',
            errorMsg: 'Run:',
            run: 'npm install --save-dev babel-plugin-istanbul@4.1.5',
            fn: shouldUseBabelInstanbul
        },
        {
            desc: 'should be using babel-plugin-transform-runtime',
            errorMsg: 'Run:',
            run:
                'npm install --save-dev babel-plugin-transform-runtime@.6.22.0',
            fn: shouldUseBabelTransformRuntime
        },
        {
            desc: 'should be using babel-preset-env',
            errorMsg: 'Run:',
            run: 'npm install --save-dev babel-preset-env@1.6.1',
            fn: shouldUseBabelPresetEnv
        },
        {
            desc: 'should be using babel-preprocessor',
            errorMsg: 'Run:',
            run: 'npm install --save-dev karma-babel-preprocessor@7.0.0',
            fn: shouldUseBabelPreprocessor
        },
        {
            desc: 'should be using puppeteer',
            errorMsg:
                'remove "phantomjs" from package.json and install "puppeteer" instead, or just run:',
            run:
                'npm uninstall --save-dev phantomjs && npm install --save-dev puppeteer',
            fn: shouldUsePuppeteer
        },
        {
            desc: 'should be using headless Chrome',
            errorMsg:
                'remove "karma-phantomjs-launcher" from package.json and install karma-chrome-launcher instead, or just run:',
            run:
                'npm uninstall --save-dev karma-phantomjs-launcher && npm install --save-dev karma-chrome-launcher@2.2.0',
            fn: shouldUseChromeLauncher
        },
        {
            desc: 'should use prepush hooks',
            errorMsg:
                'Add the following to npm scripts:\n' +
                '"prepush": "npm run lint && karma start --single-run"\n' +
                'Run:',
            run: 'npm install --save-dev husky',
            fn: shouldUsePrepushHooks
        },
        {
            desc: 'should use public require-polyfill',
            errorMsg:
                'remove "require-polyfill" from package.json and install public version, or just run:',
            run:
                'npm uninstall --save-dev require-polyfill && npm install --save-dev require-polyfill',
            fn: shouldUsePublicRequirePolyfill
        },
        {
            desc: 'should use eslint-config-gfp 4.0.0 and up',
            errorMsg:
                'set eslint-config-gfp to use version "^4.0.0" in package.json or run:',
            run: 'npm install --save-dev eslint-config-gfp@4.0.0',
            fn: shouldUseEslintConfigGfp300
        },
        {
            desc: 'should have gfp-doctor > 1.12 installed',
            errorMsg: 'Run:',
            run: 'npm install --save-dev gfp-doctor',
            fn: shouldUseGfpDoctor
        },
        {
            desc: 'should run gfp-doctor after install',
            errorMsg:
                'add the following to npm scripts:\n' +
                '"postinstall": "gfp-doctor"',
            fn: shouldRunGfpDoctorPostInstall
        },
        {
            desc: 'should use "karma" 1.7.0 and up',
            errorMsg: 'set "karma" to use "^1.7.0" or run',
            run: 'npm install --save-dev karma@1.7.0',
            fn: shouldUseKarma170
        },
        {
            desc: 'should use "karma-coverage" 1.1.0 and up',
            errorMsg: 'set "karma-coverage" to use "^1.1.0" or run:',
            run: 'npm install --save-dev karma-coverage@1.1.0',
            fn: shouldUseKarmaCoverage110
        },
        {
            desc: 'should use "karma-jasmine" 1.1.0 and up',
            errorMsg: 'set "karma-jasmine" to use "^1.1.0" or run:',
            run: 'npm install --save-dev karma-jasmine@1.1.0',
            fn: shouldUseKarmaJasmine110
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const packagePath = path.join(
        process.cwd(),
        options.packagePath || 'package.json'
    );
    log.debug(chalk.underline('Examining package.json'), options);

    log.debug(`using ${packagePath}`, options);

    if (!fs.existsSync(packagePath)) {
        log.warn(
            chalk.red('ABORTING: No package.json found in ' + process.cwd())
        );
        return addSkipped(rulesConf);
    }

    const data = fs.readFileSync(packagePath);

    const json = JSON.parse(data);

    // work through all rules, setting passed = true/false
    rulesConf.rules = processRules(rulesConf, json, options);
    return rulesConf;
};

// add more test functions below, should return true if passing the test

function notUsingStashGfpEslintConfig(json) {
    if (json.devDependencies && !json.devDependencies['gfp-eslint-config']) {
        return true;
    }
}

function missingEslintConfigGfp(json) {
    if (json.devDependencies && json.devDependencies['eslint-config-gfp']) {
        return true;
    }
}

function notUsingStashAngularModuleNoDeps(json) {
    // bail out if angular-module-no-deps isn't defined at all
    if (
        json.devDependencies &&
        !json.devDependencies['angular-module-no-deps']
    ) {
        return true;
    }

    if (
        json.devDependencies['angular-module-no-deps'].indexOf('.mrgreen.') !==
        -1
    ) {
        return false;
    }
    return true;
}

function usingDocumentationJs(json) {
    if (json.devDependencies && json.devDependencies['documentation']) {
        return true;
    }
}

function hasNpmLintScript(json) {
    if (json.scripts && json.scripts.lint) {
        return true;
    }
}

function shouldUseBabelCli(json) {
    if (json.devDependencies['babel-cli']) {
        return true;
    }
    return false;
}

function shouldUseBabelCore(json) {
    if (json.devDependencies['babel-core']) {
        return true;
    }
    return false;
}

function shouldUseBabelLoader(json) {
    if (json.devDependencies['babel-loader']) {
        return true;
    }
    return false;
}

function shouldUseBabelInstanbul(json) {
    if (json.devDependencies['babel-plugin-istanbul']) {
        return true;
    }
    return false;
}

function shouldUseBabelTransformRuntime(json) {
    if (json.devDependencies['babel-plugin-transform-runtime']) {
        return true;
    }
    return false;
}

function shouldUseBabelPresetEnv(json) {
    if (json.devDependencies['babel-preset-env']) {
        return true;
    }
    return false;
}

function shouldUseBabelPreprocessor(json) {
    if (json.devDependencies['babel-preprocessor']) {
        return true;
    }
    return false;
}

function shouldUsePuppeteer(json) {
    if (json.devDependencies) {
        if (
            json.devDependencies['phantomjs'] ||
            json.devDependencies['phantomjs-prebuilt']
        ) {
            return false;
        }
        if (json.devDependencies['puppeteer']) {
            return true;
        }
    }
}

function shouldUseChromeLauncher(json) {
    if (json.devDependencies) {
        if (json.devDependencies['karma-phantomjs-launcher']) {
            return false;
        }
        if (json.devDependencies['karma-chrome-launcher']) {
            return true;
        }
    }
}

function shouldUsePrepushHooks(json) {
    if (json.devDependencies && json.devDependencies.husky) {
        if (json.scripts && json.scripts.prepush) {
            return true;
        }
    }
}

function shouldUsePublicRequirePolyfill(json) {
    if (json.devDependencies && json.devDependencies['require-polyfill']) {
        if (json.devDependencies['require-polyfill'].includes('ssh://')) {
            return false;
        }
    }
    return true;
}

function shouldUseEslintConfigGfp300(json) {
    if (json.devDependencies) {
        if (json.devDependencies['eslint-config-gfp']) {
            if (json.devDependencies['eslint-config-gfp'] === 'latest') {
                return false;
            }
            // tries to see if 2.9.9 is less than the current range specified in package.json
            return semver.ltr(
                '3.9.9',
                json.devDependencies['eslint-config-gfp']
            );
        }
    }
}

function shouldUseGfpDoctor(json) {
    if (json.devDependencies && json.devDependencies['gfp-doctor']) {
        return (
            json.devDependencies['gfp-doctor'] === 'latest' ||
            semver.ltr('1.11.9', json.devDependencies['gfp-doctor'])
        );
    }
}

function shouldRunGfpDoctorPostInstall(json) {
    if (
        json.scripts &&
        json.scripts.postinstall &&
        json.scripts.postinstall.includes('gfp-doctor')
    ) {
        return true;
    }
}

function shouldUseKarma170(json) {
    if (json.devDependencies) {
        if (json.devDependencies['karma']) {
            if (json.devDependencies['karma'] === 'latest') {
                return false;
            }
            return semver.ltr('1.6.9', json.devDependencies['karma']);
        }
    }
}

function shouldUseKarmaCoverage110(json) {
    if (json.devDependencies) {
        if (json.devDependencies['karma-coverage']) {
            if (json.devDependencies['karma-coverage'] === 'latest') {
                return false;
            }
            return semver.ltr('1.0.9', json.devDependencies['karma-coverage']);
        }
    }
}

function shouldUseKarmaJasmine110(json) {
    if (json.devDependencies) {
        if (json.devDependencies['karma-jasmine']) {
            if (json.devDependencies['karma-jasmine'] === 'latest') {
                return false;
            }
            return semver.ltr('1.0.9', json.devDependencies['karma-jasmine']);
        }
    }
}
