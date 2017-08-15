const verboseLog = require('./logger.js');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
const addSkipped = require('./rules-util.js').addSkipped;
const processRules = require('./rules-util.js').processRules;

const rulesConf = {
    name: 'bower.json',
    rules: [
        {
            desc: 'should not have "version" property',
            errorMsg:
                'remove "version" from bower.json, bower 1.7.0 and upwards doesn\'t use it anyway',
            fn: notUsingVersion
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const filename = 'bower.json';
    const packagePath = path.join(process.cwd(), filename);
    verboseLog(chalk.underline(`Examining ${filename}`), options);

    verboseLog(`using ${packagePath}`, options);

    if (!fs.existsSync(packagePath)) {
        if (!options.silent) {
            console.error(
                chalk.red(`ABORTING: No ${filename} found in ${process.cwd()}`)
            );
        }
        return addSkipped(rulesConf);
    }

    const data = fs.readFileSync(packagePath);

    const json = JSON.parse(data);

    // work through all rules, setting passed = true/false
    rulesConf.rules = processRules(rulesConf, json, options);
    return rulesConf;
};

// add more test functions below, should return true if passing the test

function notUsingVersion(json) {
    if (json && !json.version) {
        return true;
    }
}
