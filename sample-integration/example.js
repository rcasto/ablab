import { v4 as uuidv4 } from 'uuid';
import { createExperimenter } from 'lab';
// import lab from './node_modules/lab/dist/lab.es.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { stopwatch } from './performanceUtil.js';

const numSimulations = 100;
const numCyclesPerSimulation = 100000;
let averageTimeToCompleteInMs = 0;

const experimentConfigPath = resolve('./sample-experiment-config.json');
const experimentConfig = JSON.parse(readFileSync(experimentConfigPath, {
    encoding: 'utf-8'
}));

for (let i = 0; i < numSimulations; i++) {
    const { totalTimeInMs, result: variationCounts } = stopwatch(() => {

        const variationCounts = {};
        const experimenter = createExperimenter(experimentConfig);

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