import { access, readFile } from 'fs/promises';
import { validateExperimentConfig } from './index.js';

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

access(experimentConfigPath)
    .then(async () => {
        const experimentConfigAsString = await readFile(experimentConfigPath, {
            encoding: 'utf-8',
        });
        const experimentConfigJSON = JSON.parse(experimentConfigAsString);

        switch (commandName) {
            case 'validate':
                const validationResultMap = validateExperimentConfig(experimentConfigJSON);
                console.log(JSON.stringify(validationResultMap, null, '\t'));
                break;
            case 'build':
                console.log('TODO: Support later, build experiment config, generating random seeds for experiments');
                break;
            default:
                console.error(`Invalid command provided: ${commandName}`);
                process.exit(1);
        }
    })
    .catch((err) => {
        console.error(`Invalid experiment config at path ${experimentConfigPath}: ${err}`);
        process.exit(1);
    });