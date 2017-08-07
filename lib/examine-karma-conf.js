const verboseLog = require('./logger.js');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
const addSkipped = require('./rules-util.js').addSkipped;
const processRules = require('./rules-util.js').processRules;

const rulesConf = {
    name: 'karma.conf.js',
    rules: [
        {
            desc: 'Using angular from public cdn instead of local npm installation',
            errorMsg: 'Remove "angular" and "angular-mocks" as CDN links from karma.conf.js.\n' +
                'Run "npm install --save-dev angular angular-mocks" \n' +
                'Add the following to "files" in karma.conf.js: \n' +
                "'./node_modules/angular/angular.js', \n" +
                "'./node_modules/angular-mocks/angular-mocks.js'",
            fn: notUsingAngularFromCdn
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const filename = 'karma.conf.js';
    const filePath = path.join(process.cwd(), filename);
    verboseLog(chalk.underline(`Examining ${filename}`), options);

    verboseLog(`using ${filePath}`, options);

    if (!fs.existsSync(filePath)) {
        console.error(
            chalk.red(`ABORTING: No ${filename} found in ${process.cwd()}`)
        );
        return rulesConf;
    }

    let data;
    const configSetter = {
        set: function(obj) {
            data = obj;
        }
    };

    const configFn = require(filePath);
    configFn(configSetter);

    // const json = JSON.parse(data);

    // work through all rules, setting passed = true/false
    rulesConf.rules = processRules(rulesConf, data, options);
    return rulesConf;
};

// add more test functions below, should return true if passing the test

function notUsingAngularFromCdn(karmaConfig) {
    // bail out if config not present or if files Array not defined
    if (!karmaConfig || !karmaConfig.files) {
        return true;
    }

    let foundAngularFromCdn = false;

    karmaConfig.files.forEach(file => {
        if (file.includes('angular')) {
            if (file.includes('http')) {
                foundAngularFromCdn = true;
            }
        }
    });

    return !foundAngularFromCdn;
}
