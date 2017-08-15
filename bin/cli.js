#!/usr/bin/env node
const doctor = require('../lib');
const program = require('commander');
const chalk = require('chalk');
const emoji = require('node-emoji').emoji;
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const log = require('loglevel');

updateNotifier({ pkg }).notify();

let options;

program
    .version(require('../package.json').version)
    .option('-v, --verbose', '')
    .option('-s, --silent', '')
    .option(
        '-pp, --package-path <path>',
        'override default path for package.json'
    )
    .parse(process.argv);

options = {
    verbose: program.verbose,
    silent: program.silent
};

if (options.silent) {
    log.setLevel('silent');
} else if (options.verbose) {
    log.setLevel('debug');
} else {
    log.setLevel('info');
}

try {
    log.info(`${emoji.syringe}  Running gfp-doctor v${program.version()}`);
    doctor(options);
    log.info('');
    log.info('DONE');
} catch (err) {
    log.error(chalk.red(err));
    process.exit(1);
}
