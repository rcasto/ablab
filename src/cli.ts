import { promisify } from 'util';
import { access, readFile } from 'fs';
import { ExperimentConfig, validateExperimentConfig } from './index.js';

interface ValidationResult {
    isValid: boolean;
    message: string;
}

const accessPromise = promisify(access);
const readFilePromise = promisify(readFile);

function getExperimentConfigValidationResult(experimentConfig: ExperimentConfig): ValidationResult {
    const validationResultMap = validateExperimentConfig(experimentConfig);
    const numExperimentsWithValidationErrors = Object.keys(validationResultMap).length;

    if (numExperimentsWithValidationErrors > 0) {
        return {
            isValid: false,
            message: JSON.stringify(validationResultMap, null, '\t'),
        };
    }

    return {
        isValid: true,
        message: 'Experiment config has no errors.',
    };
}

// node/npx testtube [command]
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

accessPromise(experimentConfigPath)
    .then(async () => {
        const experimentConfigAsString = await readFilePromise(experimentConfigPath, {
            encoding: 'utf-8',
        });
        const experimentConfigJSON: ExperimentConfig = JSON.parse(experimentConfigAsString);
        const validationResult = getExperimentConfigValidationResult(experimentConfigJSON);

        switch (commandName) {
            case 'validate':
                console.log(validationResult.message);
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