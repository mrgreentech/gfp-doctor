const chalk = require('chalk');
const examinePackage = require('./examine-package');
const emoji = require('node-emoji').emoji;

module.exports = run;

function run(options) {
    // run all tests
    var tests = examinePackage(options);

    // if adding more tests, join arrays above to one array for the summary below

    printSummary(tests);
    const failedTests = tests.filter(test => !test.passed);
    printDetails(failedTests);
}

function printSummary(tests) {
    const failedCount = tests.reduce(
        (sum, test) => (sum += test.passed ? 0 : 1),
        0
    );
    const passedCount = tests.reduce(
        (sum, test) => (sum += test.passed ? 1 : 0),
        0
    );

    console.log(
        `${emoji.spiral_note_pad}  Ran ${tests.length} tests, passed: ${passedCount}, failed: ${failedCount}`
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
        console.log(`${emoji.x}  ${test.desc}`);
        console.log('   Solution: ' + test.errorMsg);
    });
}
