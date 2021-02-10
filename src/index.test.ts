import { validateExperimentConfig, ExperimentConfig } from './index';

describe('validateExperimentConfig tests', () => {

    it('can return true for simple experiment config', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    control: 50,
                    treatment: 50
                }
            }
        };
        
        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(invalidExperimentReasonsMap).toEqual({});
    });

    it('can return true for simple experiment config using variation objects', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    control: {
                        traffic: 50
                    },
                    treatment: {
                        traffic: 50
                    }
                }
            }
        };
        
        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(invalidExperimentReasonsMap).toEqual({});
    });

    it('can report an error if variation traffic is not a number or object', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: 'fake-invalid-traffic-amount' as any,
                }
            }
        };
        
        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });
});