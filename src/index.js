import murmurhash from 'murmurhash';

const num_buckets = 10000;
const murmur_constant_seed = 1;
const traffic_multiplier = 100;

function validateVariationSettings(experimentName, variationName, variationSettings) {
    const invalidReasons = [];
    let variationTraffic = 0;

    if (typeof variationSettings === 'number') {
        variationTraffic = variationSettings;
    } else if (variationSettings && typeof variationSettings === 'object') {
        if (typeof variationSettings['traffic'] === 'number') {
            variationTraffic = variationSettings['traffic'];
        } else {
            invalidReasons.push(`The traffic allocated for ${variationName} within experiment ${experimentName} is negative, which is invalid: ${variationTraffic}`);
        }
    } else {
        invalidReasons.push(`The traffic allocated for ${variationName} within experiment ${experimentName} is not a number: ${variationTraffic}`);
    }

    return {
        variationTraffic,
        invalidReasons,
    };
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
            const variationSettings = variations[variationName];
            const { variationTraffic, invalidReasons: invalidVariationReasons } = validateVariationSettings(experimentName, variationName, variationSettings);
            
            totalVariationTraffic += variationTraffic;
            invalidReasons.push.apply(invalidReasons, invalidVariationReasons);
        });

        if (totalVariationTraffic > 100) {
            invalidReasons.push(`The total traffic allocated for all variations of ${experimentName} is greater than the max of 100: ${totalVariationTraffic}`);
        }
    }

    return invalidReasons;
}

function getVariationForExperiment(experimentConfig, experimentName, uniqueId) {
    const experimentSettings = experimentConfig[experimentName];

    if (!experimentSettings.active) {
        console.warn(`${experimentName} is not currently on or active`);
        return null;
    }

    const uniqueIdHash = murmurhash(uniqueId, murmur_constant_seed);
    let bucketIndex = uniqueIdHash % num_buckets;

    const experimentVariations = experimentSettings.variations;
    let assignedExperimentVariation = null;

    Object.keys(experimentVariations)
        .some(experimentVariation => {
            const experimentVariationTraffic = experimentVariations[experimentVariation];
            const maxExperimentBucketIndex = experimentVariationTraffic * traffic_multiplier;

            if (bucketIndex < maxExperimentBucketIndex) {
                assignedExperimentVariation = experimentVariation;
                return true;
            }

            bucketIndex -= maxExperimentBucketIndex;

            return false;
        });

    return assignedExperimentVariation;
}

function getVariationsForUniqueId(uniqueId) {

}

export function validateExperimentConfig(experimentConfig) {
    const experimentNames = Object.keys(experimentConfig);
    const invalidReasons = [];
    experimentNames.forEach(experimentName => {
        const experimentSettings = experimentConfig[experimentName];
        const experimentSettingsInvalidReasons = validateExperimentSettings(experimentName, experimentSettings);
        invalidReasons.push.apply(invalidReasons, experimentSettingsInvalidReasons);
    });
    return invalidReasons;
}

export function createExperimenter(experimentConfig) {
    const invalidReasons = validateExperimentConfig(experimentConfig);

    if (invalidReasons.length > 0) {
        console.error(invalidReasons);
        return null;
    }

    return {
        getVariationForExperiment: (experimentName, uniqueId) => getVariationForExperiment(experimentConfig, experimentName, uniqueId),
    };
}