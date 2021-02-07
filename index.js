import murmurhash from 'murmurhash';
import { v4 as uuidv4 } from 'uuid';
import { sampleExperimentConfig } from './sample_experiment_config.js';

const num_buckets = 10000;
const murmur_constant_seed = 1;

function validateExperimentConfig(experimentConfig) {
    const experimentNames = Object.keys(experimentConfig);
    const invalidReasons = [];
    experimentNames.forEach(experimentName => {
        const experimentSettings = experimentConfig[experimentName];
        const experimentSettingsInvalidReasons = validateExperimentSettings(experimentName, experimentSettings);
        invalidReasons.push.apply(invalidReasons, experimentSettingsInvalidReasons);
    });
    return invalidReasons;
}

function validateExperimentSettings(experimentName, experimentSettings) {
    const invalidReasons = [];

    const activeStatus = typeof experimentSettings['active'] === 'undefined' ?
        false : experimentSettings['active'];

    if (typeof activeStatus !== 'boolean') {
        invalidReasons.push(`active for ${experimentName} is not a boolean value, this is not necessarily an error, but it will be interpreted as a boolean: ${activeStatus}`);
    }

    const variations = experimentSettings['variations'];

    if (variations && typeof variations !== 'object') {
        invalidReasons.push(`variations for ${experimentName} is not an object: ${variations}`);
    } else {
        const variationNames = Object.keys(variations);
        let totalVariationTraffic = 0;

        variationNames.forEach(variationName => {
            const variationTraffic = variations[variationName];

            if (typeof variationTraffic !== 'number') {
                invalidReasons.push(`The traffic allocated for ${variationName} within experiment ${experimentName} is not a number: ${variationTraffic}`);
            } else if (variationTraffic < 0) {
                invalidReasons.push(`The traffic allocated for ${variationName} within experiment ${experimentName} is negative, which is invalid: ${variationTraffic}`);
            } else {
                totalVariationTraffic += variationTraffic;
            }
        });

        if (totalVariationTraffic > 100) {
            invalidReasons.push(`The total traffic allocated for all variations of ${experimentName} is greater than the max of 100: ${totalVariationTraffic}`);
        }
    }

    return invalidReasons;
}

export function createExperimenter(experimentConfig) {
    return {
        getVariationForExperiment: (experimentName, uniqueId) => getVariationForExperiment(experimentConfig, experimentName, uniqueId),
    };
}

export function getVariationForExperiment(experimentConfig, experimentName, uniqueId) {
    const uniqueIdHash = murmurhash(uniqueId, murmur_constant_seed);
    const bucketIndex = uniqueIdHash % num_buckets;
    
    const percentage = 50;
    const maxControlIndex = percentage * 100 - 1;

    if (bucketIndex > maxControlIndex) {
        numTreatment++;
    } else {
        numControl++;
    }
}

export function getVariationsForUniqueId(uniqueId) {

}

export function readConfig() {

}

export function fetchConfig() {

}

// Testing out murmurhash bucket distribution
// const numCycles = 10000;
// var numTreatment = 0;
// var numControl = 0;

// for (let i = 0; i < numCycles; i++) {
//     const uniqueId = uuidv4();
//     getVariationForExperiment('test-experiment', uniqueId);
// }

// console.log(`Treatment: ${numTreatment}`);
// console.log(`Control: ${numControl}`);

const invalidReasons = validateExperimentConfig(sampleExperimentConfig);
console.log(invalidReasons);