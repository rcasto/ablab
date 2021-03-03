export const sampleExperimentConfig = {
    "changing the button color": {
        "variations": {
            "treatment": {
                "traffic": 50,
                "data": {
                    "color": "yellow"
                }
            },
            "control": {
                "traffic": 50,
                "data": {
                    "color": "blue"
                }
            }
        }
    },

    "make the animation slower": {
        "variations": {
            "treatment": {
                "traffic": 50
            },
            "control": {
                "traffic": 50
            }
        }
    }
};