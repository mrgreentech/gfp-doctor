const verboseLog = require('./logger.js');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
const addSkipped = require('./rules-util.js').addSkipped;
const processRules = require('./rules-util.js').processRules;

const rulesConf = {
    name: 'eslintrc',
    rules: [
        {
            desc: 'Should use valid-jsdoc rule',
            errorMsg: 'Add the following to eslintrc:\n' +
                '"rules": {\n' +
                '   "valid-jsdoc": ["error", {\n' +
                '       "requireReturn": false\n' +
                '   }]\n' +
                '}',
            fn: usingValidJsDocRule
        },
        {
            desc: 'Should use require-jsdoc rule',
            errorMsg: 'Add the following to eslintrc:\n' +
                '"require-jsdoc": ["error"]',
            fn: usingRequireJsDocRule
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const filenames = ['.eslintrc', '.eslintrc.json', '.eslintrc.js'];
    const abortPrefix = 'ABORTING eslintrc examination';

    // find which file name we can use since eslintrc can be in many forms
    const filteredFilenames = filenames.filter(filename => {
        const filePath = path.join(process.cwd(), filename);
        return fs.existsSync(filePath);
    });

    // didn't find any matching file name
    if (!filteredFilenames.length) {
        console.error(
            chalk.red(`${abortPrefix}:`),
            `No eslintrc variation found in ${process.cwd()}`
        );
        console.log(`Unable to process ${rulesConf.rules.length} rule(s)`);
        return addSkipped(rulesConf);
    }

    const filename = filteredFilenames[0];
    const filePath = path.join(process.cwd(), filename);

    verboseLog(chalk.underline(`Examining ${filename}`), options);

    verboseLog(`using ${filePath}`, options);

    if (!fs.existsSync(filePath)) {
        console.error(
            chalk.red(`${abortPrefix}:`),
            `No ${filename} found in ${process.cwd()}`
        );
        console.log(`Unable to process ${rulesConf.rules.length} rule(s)`);
        return addSkipped(rulesConf);
    }

    // assume that a .js file extension requires "require"
    // assume that anything else is a json file
    let data;
    if (filename === '.eslintrc.js') {
        data = require(filePath);
    } else {
        data = fs.readFileSync(filePath);
    }

    // work through all rules, setting passed = true/false
    rulesConf.rules = processRules(rulesConf, data, options);
    return rulesConf;
};

// add more test functions below, should return true if passing the test

function usingValidJsDocRule(data) {
    // bail out if config not present or if rules not defined
    if (!data || !data.rules || !data.rules['valid-jsdoc']) {
        return false;
    }

    return true;
}

function usingRequireJsDocRule(data) {
    // bail out if config not present or if rules not defined
    if (!data || !data.rules || !data.rules['require-jsdoc']) {
        return false;
    }

    return true;
}
