import { access, readFile } from 'fs/promises';
import { ExperimentConfig, validateExperimentConfig } from './index.js';

interface ValidationResult {
    isValid: boolean;
    message: string;
}

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
        const experimentConfigJSON: ExperimentConfig = JSON.parse(experimentConfigAsString);
        const validationResult = getExperimentConfigValidationResult(experimentConfigJSON);

        switch (commandName) {
            case 'validate':
                console.log(validationResult.message);
                break;
            // case 'build':
            //     if (!validationResult.isValid) {
            //         console.log(validationResult.message);
            //         return;
            //     }

            //     const experimentSettings = Object.values(experimentConfigJSON);
            //     experimentSettings
            //         .forEach(experimentSetting => {
            //             if (!experimentSetting.seed) {
                            
            //             }
            //         });
            //     break;
            default:
                console.error(`Invalid command provided: ${commandName}`);
                process.exit(1);
        }
    })
    .catch((err) => {
        console.error(`Invalid experiment config at path ${experimentConfigPath}: ${err}`);
        process.exit(1);
    });