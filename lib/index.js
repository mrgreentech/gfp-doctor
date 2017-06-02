const chalk = require('chalk');
const examinePackage = require('./examine-package');
const examineKarmaConf = require('./examine-karma-conf');
const examineEslintrc = require('./examine-eslintrc');
const examineBower = require('./examine-bower');
const emoji = require('node-emoji').emoji;

module.exports = run;

function run(options) {
    // run all tests
    let tests = [
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

    printSummary(concatenatedTests);
    const failedTests = concatenatedTests.filter(test => test.failed);
    printDetails(failedTests);
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

    console.log('');
    console.log(
        `${emoji.checkered_flag}  Ran ${tests.length} tests, passed: ${passedCount}, failed: ${failedCount}, skipped: ${skippedCount}`
    );

    if (failedCount) {
        console.log('');

        console.log(chalk.red.underline('Failed tests'));
    } else {
        console.log(chalk.green(`${emoji.ok_hand}  No failed tests!`));
    }
}

function printDetails(tests) {
    tests.forEach((test, index) => {
        console.log(`${emoji.x}  ${test.testSuiteName}: ${test.desc}`);
        console.log('   Solution: ' + test.errorMsg);
    });
}
