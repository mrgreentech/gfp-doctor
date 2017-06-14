const verboseLog = require('./logger.js');
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
            errorMsg: 'remove "gfp-eslint-config" from package.json and run "npm install --save-dev eslint eslint-config-gfp"',
            fn: notUsingStashGfpEslintConfig
        },
        {
            desc: 'using eslint-config-gfp',
            errorMsg: 'run "npm install --save-dev eslint-config-gfp"',
            fn: missingEslintConfigGfp
        },
        {
            desc: 'using public npm version of angular-module-no-deps',
            errorMsg: 'remove "angular-module-no-deps" from package.json and run "npm install --save-dev angular-module-no-deps"',
            fn: notUsingStashAngularModuleNoDeps
        },
        {
            desc: 'using documentationjs',
            errorMsg: 'should be using documentationjs to generate JSDoc to README: "npm install --save-dev documentation" \n' +
                'then add scripts: \n' +
                '"docs": "npm run docs:md",\n' +
                '"docs:md": "documentation readme <source files>.js --section "API""',
            fn: usingDocumentationJs
        },
        {
            desc: 'has npm script lint',
            errorMsg: 'should have a npm script lint\n' +
                'then add script: \n' +
                '"lint": "eslint *.js"',
            fn: hasNpmLintScript
        },
        {
            desc: 'should be using phantomjs-prebuilt',
            errorMsg: 'remove phantomjs from package.json, then run \n' +
                'npm install --save-dev phantomjs-prebuilt',
            fn: shouldUsePhantomjsPrebuilt
        },
        {
            desc: 'should use "karma-phantomjs-launcher" 1 and up',
            errorMsg: 'set "karma-phantomjs-launcher" to use "^1.0.0"',
            fn: shouldUsePhantomjsLauncher1
        },
        {
            desc: 'should prepush hooks',
            errorMsg: 'run:\n' +
                'npm install --save-dev husky\n' +
                'then add the following to npm scripts:\n' +
                '"prepush": "npm run lint && karma start --single-run"',
            fn: shouldUsePrepushHooks
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const packagePath = path.join(process.cwd(), 'package.json');
    verboseLog(chalk.underline('Examining package.json'), options);

    verboseLog(`using ${packagePath}`, options);

    if (!fs.existsSync(packagePath)) {
        console.error(
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
        json.devDependencies['angular-module-no-deps'].indexOf(
            'stash.mrgreen.zone'
        ) !== -1
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

function shouldUsePhantomjsPrebuilt(json) {
    if (json.devDependencies) {
        if (json.devDependencies['phantomjs']) {
            return false;
        }
        if (json.devDependencies['phantomjs-prebuilt']) {
            return true;
        }
    }
}

function shouldUsePhantomjsLauncher1(json) {
    if (json.devDependencies) {
        if (json.devDependencies['karma-phantomjs-launcher']) {
            return semver.satisfies(
                '1.0.0',
                json.devDependencies['karma-phantomjs-launcher']
            );
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
