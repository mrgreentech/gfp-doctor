const verboseLog = require('./logger.js');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const process = require('process');
const addSkipped = require('./rules-util.js').addSkipped;
const processRules = require('./rules-util.js').processRules;
const rulesConf = {
    name: '.babelrc',
    rules: [
        {
            desc: 'Should use plugin istanbul',
            errorMsg:
                'Add the following to babelrc:\n' +
                '"env": {\n' +
                '   "test": {\n' +
                '       "plugins": [ "istanbul" ]\n' +
                '   }\n' +
                '}',
            fn: usingIstanbulPlugin
        },
        {
            desc: 'Should use babel-preset-env to polyfill browser support.',
            errorMsg:
                'Add the following to babelrc:\n' +
                '"presets": [\n' +
                '   ["babel-preset-env", {\n' +
                '       "targets": {\n' +
                '           "browsers": ["last 2 versions", "safari >= 7"]\n' +
                '        }\n' +
                '   }]\n' +
                ']',
            fn: usingBabelPresetEnv
        }
    ]
};

module.exports = function(options) {
    'use strict';
    const filenames = ['.babelrc', '.babelrc.json', '.babelrc.js'];
    const abortPrefix = 'ABORTING babelrc examination';

    // find which file name we can use since babelrc can be in many forms
    const filteredFilenames = filenames.filter(filename => {
        const filePath = path.join(process.cwd(), filename);
        return fs.existsSync(filePath);
    });

    // didn't find any matching file name
    if (!filteredFilenames.length) {
        console.error(
            chalk.red(`${abortPrefix}:`),
            `No babel config found in ${process.cwd()}\n` +
                'Please create a .babelrc file'
        );
        console.log(`Unable to process ${rulesConf.rules.length} rule(s)`);
        return addSkipped(rulesConf);
    } else {
        if (filteredFilenames.length > 1) {
            console.error(
                chalk.red(`${abortPrefix}:`),
                `Multiple .babelrc files found ${process.cwd()}\n` +
                    'Please only use .babelrc file'
            );
            console.log(`Unable to process ${rulesConf.rules.length} rule(s)`);
            return addSkipped(rulesConf);
        }
    }

    const filename = filteredFilenames.reduce(
        (filenames, currentFile) => filenames + currentFile
    );

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
    if (filename === '.babelrc.js') {
        data = require(filePath);
    } else {
        data = fs.readFileSync(filePath);

        // If we're already assuming that it's JSON, lets
        // try parsing it as JSON
        try {
            data = JSON.parse(data);
        } catch (e) {
            verboseLog(e);
            console.error(
                chalk.red(`${abortPrefix}:`),
                'Could not interpet babel. This issue may occur when you have invalid json in your .babelrc'
            );
            return addSkipped(rulesConf);
        }
    }

    // work through all rules, setting passed = true/false
    rulesConf.rules = processRules(rulesConf, data, options);
    return rulesConf;
};

// add more test functions below, should return true if passing the test

function usingIstanbulPlugin(data) {
    // bail out if config not present or if rules not defined
    if (!data || !data.env || !data.env || !data.env.test) {
        return false;
    }

    return true;
}

function usingBabelPresetEnv(data) {
    // bail out if config not present or if rules not defined
    if (!data || !data.presets) {
        return false;
    }

    return true;
}
