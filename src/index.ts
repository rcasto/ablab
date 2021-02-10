import murmurhash from 'murmurhash';

const num_buckets = 10000;
const murmur_constant_seed = 1;
const traffic_multiplier = 100;

interface VariationSettingsObject {
    traffic: number;
    data?: {
        [customKey: string]: any;
    };
}

type VariationSettings = number | VariationSettingsObject;

interface ExperimentSettings {
    inactive?: boolean;
    variations: {
        [variationName: string]: VariationSettings;
    };
}

interface ExperimentConfig {
    [experimentName: string]: ExperimentSettings;
}

type VariationAssignment = null | {
    variationName: string;
};

interface Experimenter {
    getVariationForExperiment: (experimentName: string, uniqueId: string) => VariationAssignment;
}

type InvalidVariationReasons = string[];

interface InvalidExperimentReasons {
    invalidReasons: string[];
    variations: {
        [variationName: string]: string[];  
    };
}

interface InvalidExperimentReasonsMap {
    [experimentName: string]: InvalidExperimentReasons;
}

function normalizeVariationSettings(variationSettings: VariationSettings): VariationSettingsObject {
    if (typeof variationSettings === 'number') {
        return {
            traffic: variationSettings,
        };
    }
    return variationSettings;
}

function validateVariationSettings(experimentName: string, variationName: string, variationSettings: VariationSettings): { 
    invalidReasons: InvalidVariationReasons,
    variationTraffic: number
} {
    const invalidReasons = [];
    let variationTraffic = 0;

    if (typeof variationSettings === 'number') {
        variationTraffic = variationSettings;
    } else if (variationSettings && typeof variationSettings === 'object') {
        if (typeof variationSettings.traffic === 'number') {
            variationTraffic = variationSettings.traffic;
        } else {
            invalidReasons.push(`The traffic allocated for ${variationName} within experiment ${experimentName} is not a number: ${variationSettings.traffic}`);
        }
    } else {
        invalidReasons.push(`The settings for ${variationName} within experiment ${experimentName} are not a number or object: ${variationSettings}`);
    }

    return {
        variationTraffic,
        invalidReasons,
    };
}

function validateExperimentSettings(experimentName: string, experimentSettings: ExperimentSettings): InvalidExperimentReasons {
    const invalidExperimentReasonsMap: InvalidExperimentReasons = {
        invalidReasons: [],
        variations: {},
    };

    const inactiveStatus = typeof experimentSettings.inactive === 'undefined' ?
        false : experimentSettings.inactive;

    if (typeof inactiveStatus !== 'boolean') {
        invalidExperimentReasonsMap.invalidReasons.push(`inactive for ${experimentName} is not a boolean value: ${inactiveStatus}`);
    }

    const variations = experimentSettings['variations'];

    if (variations && typeof variations !== 'object') {
        invalidExperimentReasonsMap.invalidReasons.push(`variations for ${experimentName} is not an object: ${variations}`);
    } else {
        const variationNames = Object.keys(variations);
        let totalVariationTraffic = 0;

        variationNames.forEach(variationName => {
            const variationSettings = variations[variationName];
            const { variationTraffic, invalidReasons: invalidVariationReasons } = validateVariationSettings(experimentName, variationName, variationSettings);
            
            totalVariationTraffic += variationTraffic;
            invalidExperimentReasonsMap.variations[variationName] = invalidVariationReasons;
        });

        if (totalVariationTraffic > 100) {
            invalidExperimentReasonsMap.invalidReasons.push(`The total traffic allocated for all variations of ${experimentName} is greater than the max of 100: ${totalVariationTraffic}`);
        }
    }

    return invalidExperimentReasonsMap;
}

function getVariationForExperiment(experimentConfig: ExperimentConfig, experimentName: string, uniqueId: string): VariationAssignment {
    const experimentSettings = experimentConfig[experimentName];

    if (experimentSettings.inactive) {
        console.warn(`${experimentName} is not currently on or active`);
        return null;
    }

    const uniqueIdHash = murmurhash(uniqueId, murmur_constant_seed);
    let bucketIndex = uniqueIdHash % num_buckets;

    const experimentVariations = experimentSettings.variations;
    let assignedExperimentVariation = null;

    Object.keys(experimentVariations)
        .some(experimentVariation => {
            const experimentVariationSettings = normalizeVariationSettings(experimentVariations[experimentVariation]);
            const maxExperimentVariationBucketIndex = experimentVariationSettings.traffic * traffic_multiplier;

            if (bucketIndex < maxExperimentVariationBucketIndex) {
                assignedExperimentVariation = experimentVariation;
                return true;
            }

            bucketIndex -= maxExperimentVariationBucketIndex;

            return false;
        });

    return assignedExperimentVariation;
}

// function getVariationsForUniqueId(uniqueId) {

// }

export function validateExperimentConfig(experimentConfig: ExperimentConfig): InvalidExperimentReasonsMap {
    const experimentNames = Object.keys(experimentConfig);
    const invalidReasons: InvalidExperimentReasonsMap = {};
    experimentNames.forEach(experimentName => {
        const experimentSettings = experimentConfig[experimentName];
        invalidReasons[experimentName] = validateExperimentSettings(experimentName, experimentSettings);
    });
    return invalidReasons;
}

export function createExperimenter(experimentConfig: ExperimentConfig): Experimenter | null {
    const invalidReasons = validateExperimentConfig(experimentConfig);

    if (Object.keys(invalidReasons).length > 0) {
        console.error(invalidReasons);
        return null;
    }

    return {
        getVariationForExperiment: (experimentName, uniqueId) => getVariationForExperiment(experimentConfig, experimentName, uniqueId),
    };
}