const chalk = require('chalk');
const examineBabelrc = require('./examine-babelrc');
const examinePackage = require('./examine-package');
const examineKarmaConf = require('./examine-karma-conf');
const examineEslintrc = require('./examine-eslintrc');
const examineBower = require('./examine-bower');
const emoji = require('node-emoji').emoji;
const log = require('loglevel');

module.exports = run;

function run(options = {}) {
    if (options.silent) {
        log.setLevel('silent');
    } else if (options.verbose) {
        log.setLevel('debug');
    } else {
        log.setLevel('info');
    }

    // run all tests
    let tests = [
        examineBabelrc(options),
        examinePackage(options),
        examineKarmaConf(options),
        examineEslintrc(options),
        examineBower(options)
    ];

    // map each "name" property from rulesObj down to each rules object
    tests.forEach(testSuite => {
        testSuite.rules.forEach(test => {
            test.testSuiteName = testSuite.name;
        });
    });

    let concatenatedTests = tests.reduce(
        (prev, curr) => prev.concat(curr.rules),
        []
    );
    // if adding more tests, join arrays above to one array for the summary below

    const failedTests = concatenatedTests.filter(test => test.failed);

    if (!options.silent) {
        printSummary(concatenatedTests);
        printDetails(failedTests);
    }

    const returnObj = {
        status: failedTests > 0 ? 'failed' : 'success',
        success: failedTests === 0,
        failed: failedTests > 0,
        tests: concatenatedTests
    };

    return returnObj;
}

function printSummary(tests) {
    const failedCount = tests.reduce(
        (sum, test) => (sum += test.failed ? 1 : 0),
        0
    );
    const passedCount = tests.reduce(
        (sum, test) => (sum += test.passed ? 1 : 0),
        0
    );

    const skippedCount = tests.reduce(
        (sum, test) => (sum += test.skipped ? 1 : 0),
        0
    );

    log.info('');
    log.info(
        `${emoji.checkered_flag}  Ran ${tests.length} tests, passed: ${passedCount}, failed: ${failedCount}, skipped: ${skippedCount}`
    );

    if (failedCount) {
        log.info('');

        log.info(chalk.red.underline('Failed tests'));
    } else {
        log.info(chalk.green(`${emoji.ok_hand}  No failed tests!`));
    }
}

function printDetails(tests) {
    tests.forEach((test, index) => {
        log.info(`${emoji.x}  ${test.testSuiteName}: ${test.desc}`);
        log.info(`   Solution: ${test.errorMsg}`);
        log.info(test.run ? `   ${test.run}\n` : '');
    });
}
