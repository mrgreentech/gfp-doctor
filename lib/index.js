const chalk = require('chalk');
const examinePackage = require('./examine-package');
const emoji = require('node-emoji').emoji;

const indent = '  ';

module.exports = run;

function run(options) {
    var tests = examinePackage(options);

    printSummary(tests);
    const failedTests = tests.filter(test => !test.passed);
    printFailedTests(failedTests);
}

function printSummary(tests) {
    const failed = tests.reduce((sum, test) => (sum += test.passed ? 0 : 1), 0);
    const passed = tests.reduce((sum, test) => (sum += test.passed ? 1 : 0), 0);
    console.log(
        `${emoji.spiral_note_pad}  Ran ${tests.length} tests, passed: ${passed}, failed: ${failed}`
    );
}

function printFailedTests(tests) {
    if (tests.length) {
        console.log('');

        console.log(chalk.red.underline('Failed tests'));
    } else {
        console.log(chalk.green(`${emoji.ok_hand}  No failed tests!`));
    }

    tests.forEach((test, index) => {
        console.log(`${emoji.x}  ${test.desc}`);
        console.log('   Solution: ' + test.errorMsg);
    });
}
