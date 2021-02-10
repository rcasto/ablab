import { validateExperimentConfig } from './index.js';

describe('validateExperimentConfig tests', () => {

    it('can return true for simple experiment config', () => {
        const experimentConfig = {
            "experiment1": {
                "variations": {
                    "control": 50,
                    "treatment": 50
                }
            }
        };
        
        const invalidReasons = validateExperimentConfig(experimentConfig);

        expect(Array.isArray(invalidReasons)).toBeTruthy();
        expect(invalidReasons.length).toEqual(0);
    });

});