import {
    createExperimenter,
    validateExperimentConfig,
    ExperimentConfig
} from './index';

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

    it('can report an error if variation traffic is < 0', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: -1,
                }
            }
        };

        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });

    it('can report an error if variation traffic is < 0 - object form', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: {
                        traffic: -1,
                    },
                }
            }
        };

        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });

    it('can report an error if variation traffic is > 100', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: 101,
                }
            }
        };

        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });

    it('can report an error if variation traffic is > 100 - object form', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: {
                        traffic: 101,
                    },
                }
            }
        };

        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });

    it('can report an error if total variation traffic is over 100', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: 50,
                    control: 51,
                }
            }
        };

        const invalidExperimentReasonsMap = validateExperimentConfig(experimentConfig);

        expect(Object.keys(invalidExperimentReasonsMap).length).toEqual(1);
    });
});

describe('createExperimenter tests', () => {
    it('can return null and log error on invalid experiment config', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    treatment: {
                        traffic: -1,
                    },
                }
            }
        };
        spyOn(console, 'error');

        const result = createExperimenter(experimentConfig);

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });

    it('can return experimenter object on valid experiment config', () => {
        const experimentConfig: ExperimentConfig = {
            experiment1: {
                variations: {
                    control: 50,
                    treatment: 50
                }
            }
        };

        const result = createExperimenter(experimentConfig);

        expect(typeof result === 'object').toBeTruthy();
        expect(typeof result?.getVariationForExperiment === 'function');
    });

    describe('getVariationForExperiment tests', () => {
        it('can return null for invalid experiment', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        control: 50,
                        treatment: 50
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);
            spyOn(console, 'warn');

            const result = experimenter?.getVariationForExperiment('invalid-experiment', '');

            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it('can return null and warn on inactive experiment', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    inactive: true,
                    variations: {
                        control: 50,
                        treatment: 50
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);
            spyOn(console, 'warn');

            const result = experimenter?.getVariationForExperiment('experiment1', '');

            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it('can return variation assignment object with empty object variation data', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 100
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result = experimenter?.getVariationForExperiment('experiment1', '');

            expect(result).toBeDefined();
            expect(result?.variationName).toEqual('treatment');
            expect(result?.variationData).toEqual({});
        });

        it('can return variation assignment object with variation data', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: {
                            traffic: 100,
                            data: {
                                data1: 'fake-data',
                                data2: 42,
                                data3: {
                                    data4: 'more-fake-data'
                                }
                            }
                        }
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result = experimenter?.getVariationForExperiment('experiment1', '');

            expect(result).toBeDefined();
            expect(result?.variationName).toEqual('treatment');
            expect(result?.variationData).toEqual({
                data1: 'fake-data',
                data2: 42,
                data3: {
                    data4: 'more-fake-data'
                }
            });
        });

        it('can return deterministic variation assignment object for given unique id', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 50,
                        control: 50,
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result1 = experimenter?.getVariationForExperiment('experiment1', '');
            const result2 = experimenter?.getVariationForExperiment('experiment1', '');

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1?.variationName).toEqual(result2?.variationName);
            expect(result1?.variationData).toEqual(result2?.variationData);
        });

        it('can return deterministic variation assignment object for a given unique id for the same experiment', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 50,
                        control: 50,
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result1 = experimenter?.getVariationForExperiment('experiment1', '');
            const result2 = experimenter?.getVariationForExperiment('experiment1', '');

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1?.variationName).toEqual(result2?.variationName);
            expect(result1?.variationData).toEqual(result2?.variationData);
        });

        it('can return different variation assignment object for a given unique id for different experiments with the same setup', () => {
            const experimentConfig1: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 50,
                        control: 50,
                    }
                },
                fakeExperiment: {
                    variations: {
                        treatment: 50,
                        control: 50,
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig1);

            const result1 = experimenter?.getVariationForExperiment('experiment1', '');
            const result2 = experimenter?.getVariationForExperiment('fakeExperiment', '');

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1?.variationName).not.toEqual(result2?.variationName);
            expect(result1?.variationData).toEqual(result2?.variationData);
        });
    });

    describe('getVariationsForUniqueId tests', () => {
        it('can return empty experiment variation assignment map when there are no experiments', () => {
            const experimentConfig: ExperimentConfig = {};
            const experimenter = createExperimenter(experimentConfig);

            const result = experimenter?.getVariationsForUniqueId('');

            expect(result).toEqual({});
        });

        it('can return experiment variation assignment map for 1 experiment', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 100
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result = experimenter?.getVariationsForUniqueId('');

            expect(result).toEqual({
                experiment1: {
                    variationName: 'treatment',
                    variationData: {},
                }
            });
        });

        it('can return experiment variation assignment map for 2 or more experiments', () => {
            const experimentConfig: ExperimentConfig = {
                experiment1: {
                    variations: {
                        treatment: 100
                    }
                },
                experiment2: {
                    variations: {
                        control: 100
                    }
                }
            };
            const experimenter = createExperimenter(experimentConfig);

            const result = experimenter?.getVariationsForUniqueId('');

            expect(result).toEqual({
                experiment1: {
                    variationName: 'treatment',
                    variationData: {},
                },
                experiment2: {
                    variationName: 'control',
                    variationData: {},
                }
            });
        });
    });
});