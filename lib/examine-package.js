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
                'remove "gfp-eslint-config" from package.json and run "npm install --save-dev eslint eslint-config-gfp"',
            fn: notUsingStashGfpEslintConfig
        },
        {
            desc: 'using eslint-config-gfp',
            errorMsg: 'run "npm install --save-dev eslint-config-gfp"',
            fn: missingEslintConfigGfp
        },
        {
            desc: 'using public npm version of angular-module-no-deps',
            errorMsg:
                'remove "angular-module-no-deps" from package.json and run \n "npm install --save-dev angular-module-no-deps"',
            fn: notUsingStashAngularModuleNoDeps
        },
        {
            desc: 'using documentationjs',
            errorMsg:
                'should be using documentationjs to generate JSDoc to README: \n "npm install --save-dev documentation" \n' +
                'then add scripts: \n' +
                '"docs": "npm run docs:md",\n' +
                '"docs:md": "documentation readme <source files>.js --section \'API\'"',
            fn: usingDocumentationJs
        },
        {
            desc: 'has npm script lint',
            errorMsg:
                'should have a npm script lint\n' +
                'then add script: \n' +
                '"lint": "eslint *.js"',
            fn: hasNpmLintScript
        },
        {
            desc: 'should be using babel-cli',
            errorMsg: 'run:\n' + 'npm install --save-dev babel-cli' + '\n',
            fn: shouldUseBabelCli
        },
        {
            desc: 'should be using babel-core',
            errorMsg: 'run:\n' + 'npm install --save-dev babel-core' + '\n',
            fn: shouldUseBabelCore
        },
        {
            desc: 'should be using babel-loader',
            errorMsg: 'run:\n' + 'npm install --save-dev babel-loader' + '\n',
            fn: shouldUseBabelLoader
        },
        {
            desc: 'should be using babel-plugin-istanbul',
            errorMsg:
                'run:\n' +
                'npm install --save-dev babel-plugin-istanbul' +
                '\n',
            fn: shouldUseBabelInstanbul
        },
        {
            desc: 'should be using babel-plugin-transform-runtime',
            errorMsg:
                'run:\n' +
                'npm install --save-dev babel-plugin-transform-runtime' +
                '\n',
            fn: shouldUseBabelTransformRuntime
        },
        {
            desc: 'should be using babel-preset-env',
            errorMsg:
                'run:\n' + 'npm install --save-dev babel-preset-env' + '\n',
            fn: shouldUseBabelPresetEnv
        },
        {
            desc: 'should be using puppeteer',
            errorMsg:
                'remove phantomjs from package.json, then run \n' +
                'npm install --save-dev puppeteer',
            fn: shouldUsePuppeteer
        },
        {
            desc: 'should be using headless Chrome',
            errorMsg:
                'remove "karma-phantomjs-launcher", then run \n' +
                'npm install --save-dev karma-chrome-launcher',
            fn: shouldUseChromeLauncher
        },
        {
            desc: 'should use prepush hooks',
            errorMsg:
                'run:\n' +
                'npm install --save-dev husky\n' +
                'then add the following to npm scripts:\n' +
                '"prepush": "npm run lint && karma start --single-run"',
            fn: shouldUsePrepushHooks
        },
        {
            desc: 'should use public require-polyfill',
            errorMsg:
                'remove require-polyfill from package.json, then run \n' +
                'npm install --save-dev require-polyfill\n',
            fn: shouldUsePublicRequirePolyfill
        },
        {
            desc: 'should use eslint-config-gfp 3.0.0 and up',
            errorMsg:
                'set eslint-config-gfp to use version "^3.0.0" in package.json',
            fn: shouldUseEslintConfigGfp300
        },
        {
            desc: 'should have gfp-doctor >1.9 installed',
            errorMsg: 'run:\n' + 'npm install --save-dev gfp-doctor',
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
            errorMsg: 'set "karma" to use "^1.7.0"',
            fn: shouldUseKarma170
        },
        {
            desc: 'should use "karma-coverage" 1.1.0 and up',
            errorMsg: 'set "karma-coverage" to use "^1.1.0"',
            fn: shouldUseKarmaCoverage110
        },
        {
            desc: 'should use "karma-jasmine" 1.1.0 and up',
            errorMsg: 'set "karma-coverage" to use "^1.1.0"',
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
    if (!json.devDependencies['babel-cli']) {
        return false;
    }
    if (json.devDependencies['babel-cli']) {
        return true;
    }
}

function shouldUseBabelCore(json) {
    if (!json.devDependencies['babel-core']) {
        return false;
    }
    if (json.devDependencies['babel-core']) {
        return true;
    }
}

function shouldUseBabelLoader(json) {
    if (!json.devDependencies['babel-loader']) {
        return false;
    }
    if (json.devDependencies['babel-loader']) {
        return true;
    }
}

function shouldUseBabelInstanbul(json) {
    if (!json.devDependencies['babel-plugin-istanbul']) {
        return false;
    }
    if (json.devDependencies['babel-plugin-istanbul']) {
        return true;
    }
}

function shouldUseBabelTransformRuntime(json) {
    if (!json.devDependencies['babel-plugin-transform-runtime']) {
        return false;
    }
    if (json.devDependencies['babel-plugin-transform-runtime']) {
        return true;
    }
}

function shouldUseBabelPresetEnv(json) {
    if (!json.devDependencies['babel-preset-env']) {
        return false;
    }
    if (json.devDependencies['babel-preset-env']) {
        return true;
    }
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
                '2.9.9',
                json.devDependencies['eslint-config-gfp']
            );
        }
    }
}

function shouldUseGfpDoctor(json) {
    if (json.devDependencies && json.devDependencies['gfp-doctor']) {
        return (
            json.devDependencies['gfp-doctor'] === 'latest' ||
            semver.ltr('1.8.9', json.devDependencies['gfp-doctor'])
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
