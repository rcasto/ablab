import { validateExperimentConfig } from './index';

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
        
        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(invalidExperimentReasonsMap).toEqual({});
    });

});