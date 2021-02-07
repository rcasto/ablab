import { v4 as uuidv4 } from 'uuid';
import { sampleExperimentConfig } from './sample_experiment_config.js';
import { createExperimenter } from './index.js';

// Testing out murmurhash bucket distribution
const numCycles = 10000;
const variationCounts = {};
const experimenter = createExperimenter(sampleExperimentConfig);

for (let i = 0; i < numCycles; i++) {
    const uniqueId = uuidv4();
    const variation = experimenter.getVariationForExperiment('multiple-variations', uniqueId);
    
    variationCounts[variation] = (variationCounts[variation] || 0) + 1;
}

console.log(variationCounts);