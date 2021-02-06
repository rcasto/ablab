import murmurhash from 'murmurhash';
import { v4 as uuidv4 } from 'uuid';
import { sampleExperimentConfig } from './sample_experiment_config.js';

const num_buckets = 10000;
const murmur_constant_seed = 1;

function validateExperimentConfig(experimentConfig) {
    const experimentNames = Object.keys(experimentConfig);
    experimentNames.forEach(experimentName => {
        const experimentSettings = experimentConfig[experimentName];
        validateExperimentSettings(experimentName, experimentSettings);
    });
}

function validateExperimentSettings(experimentName, experimentSettings) {
    const invalidReasons = [];

    const trafficAllocation = experimentSettings['traffic_allocation'] || 100;
    const activeStatus = experimentSettings['active'];

    if (typeof trafficAllocation !== 'number' ||
        trafficAllocation < 0 ||
        trafficAllocation > 100) {
        invalidReasons.push(`traffic_allocation for ${experimentName} is invalid, must be a number 0 <= x <= 100: ${trafficAllocation}`);
    }

    if (typeof activeStatus !== 'boolean') {
        invalidReasons.push(`active for ${experimentName} is not a boolean value, this is not necessarily an error, but it will be interpreted as a boolean: ${activeStatus}`);
    }

    const variations = experimentSettings['variations'];

    // whoops variations is an object
    // if (!Array.isArray(variations)) {
    //     invalidReasons.push(`variations for ${experimentName} is not an array: ${variations}`);
    // } else {
    //     let totalVariationTraffic = 0;
    //     variations.forEach(variation => {

    //     });
    // }
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
const numCycles = 10000;
var numTreatment = 0;
var numControl = 0;

for (let i = 0; i < numCycles; i++) {
    const uniqueId = uuidv4();
    getVariationForExperiment('test-experiment', uniqueId);
}

console.log(`Treatment: ${numTreatment}`);
console.log(`Control: ${numControl}`);