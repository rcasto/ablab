#!/usr/bin/env node

import { validateExperimentConfig } from './index';

// node/npx lab [command]
const commandName = (process.argv[2] || '').toLowerCase();
const experimentConfigPath = process.argv[3] || ''

if (!commandName) {
    console.error(`No command provided`);
    process.exit(1);
}

if (!experimentConfigPath) {
    console.error(`No experiment config path provided`);
    process.exit(1);
}

switch (commandName) {
    case 'validate':
        console.log('should validate experiment config');
    case 'build':
        console.log('TODO: Support later, build experiment config, generating random seeds for experiments');
    default:
        console.error(`Invalid command provided: ${commandName}`);
        process.exit(1);
}