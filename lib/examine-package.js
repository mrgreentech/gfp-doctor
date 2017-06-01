const verboseLog = require('./logger.js');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
// const getCheckList = require('./checkList.js');

const checks = [
    {
        desc: 'using public npm version of gfp eslint config',
        errorMsg: 'remove "gfp-eslint-config" from package.json and run "npm install --save-dev eslint-config-gfp"',
        fn: notUsingStashGfpEslintConfig
    }
];

module.exports = function(options) {
    'use strict';
    const packagePath = path.join(process.cwd(), 'package.json');
    verboseLog(chalk.underline('Examining package.json'), options);

    verboseLog(`using ${packagePath}`, options);

    if (!fs.existsSync(packagePath)) {
        console.error(
            chalk.red('ABORTING: No package.json found in ' + process.cwd())
        );
        return checks;
    }

    const data = fs.readFileSync(packagePath);

    const json = JSON.parse(data);

    return checks.map(rule => {
        verboseLog('checking rule: ' + rule.desc, options);
        // if any return false, they have not passed the test
        rule.passed = rule.fn(json);
        if (rule.passed) {
            verboseLog(chalk.green('  passed'), options);
        } else {
            verboseLog(chalk.red('  failed'), options);
        }
        return rule;
    });
};

function notUsingStashGfpEslintConfig(json) {
    if (json.devDependencies && !json.devDependencies['gfp-eslint-config']) {
        return true;
    }
}
