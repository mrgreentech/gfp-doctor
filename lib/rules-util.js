const chalk = require('chalk');
const emoji = require('node-emoji').emoji;
const verboseLog = require('./logger.js');

module.exports.addSkipped = addSkipped;
module.exports.processRules = processRules;

function addSkipped(rulesConf) {
    rulesConf.rules = rulesConf.rules.map(rule => {
        rule.skipped = true;
        return rule;
    });
    return rulesConf;
}

function processRules(rulesConf, data, options) {
    return rulesConf.rules.map(rule => {
        verboseLog('checking rule: ' + rule.desc, options);
        // if any return false, they have not passed the test

        if (rule.skipped) {
            verboseLog(chalk.grey('  skipped'), options);
            return rule;
        }

        rule.passed = !!rule.fn(data);
        rule.failed = !rule.passed;
        if (rule.passed) {
            verboseLog(
                chalk.green(`${emoji.white_check_mark}  passed`),
                options
            );
        } else {
            verboseLog(chalk.red('  failed'), options);
        }
        return rule;
    });
}
