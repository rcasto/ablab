import { v4 as uuidv4 } from 'uuid';
import { createExperimenter } from 'lab';
// import { createExperimenter } from '../dist/lab.es.js';

import { sampleExperimentConfig } from './sample_experiment_config.js';
import { stopwatch } from './performanceUtil.js';

const numSimulations = 100;
const numCyclesPerSimulation = 100000;
let averageTimeToCompleteInMs = 0;

for (let i = 0; i < numSimulations; i++) {
    const { totalTimeInMs, result: variationCounts } = stopwatch(() => {

        const variationCounts = {};
        const experimenter = createExperimenter(sampleExperimentConfig);

        for (let i = 0; i < numCyclesPerSimulation; i++) {
            const uniqueId = uuidv4();
            const variationResult = experimenter.getVariationForExperiment('changing the button color', uniqueId);

            variationCounts[variationResult.variationName] = (variationCounts[variationResult.variationName] || 0) + 1;
        }

        return variationCounts;
    });

    averageTimeToCompleteInMs = (averageTimeToCompleteInMs * i + totalTimeInMs) / (i + 1);

    console.log(variationCounts);
}

console.log(`Average time to complete (ms): ${averageTimeToCompleteInMs}`);