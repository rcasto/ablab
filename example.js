import { v4 as uuidv4 } from 'uuid';
import { sampleExperimentConfig } from './sample_experiment_config.js';
import { createExperimenter } from './index.js';
import { stopwatch } from './performanceUtil.js';

const numSimulations = 100;
const numCyclesPerSimulation = 100000;
let averageTimeToCompleteInMs = 0;

for (let i = 0; i < numSimulations; i++) {
    const { totalTimeInMs } = stopwatch(() => {

        const variationCounts = {};
        const experimenter = createExperimenter(sampleExperimentConfig);

        for (let i = 0; i < numCyclesPerSimulation; i++) {
            const uniqueId = uuidv4();
            const variation = experimenter.getVariationForExperiment('multiple-variations', uniqueId);

            variationCounts[variation] = (variationCounts[variation] || 0) + 1;
        }

        console.log(variationCounts);
    });

    averageTimeToCompleteInMs = (averageTimeToCompleteInMs * i + totalTimeInMs) / (i + 1);
}

console.log(`Average time to complete (ms): ${averageTimeToCompleteInMs}`);