# lab
A simple library for enabling experimentation.

This library primarily offers experiment bucketing and defines a schema for experiments using a JSON based config.

## Usage

## Experiment Schema

## Scope of this project
Configuration should support:
- Multiple experiments
    - Also, of course, multiple variations per experiment
- Turn experiment on/off
    - Experiments are enabled by default
    - Experiments do support being inactivated though, or turned off
- Specifying variations A/B/C/.... and their traffic allocation
    - Variations support custom naming
    - Variations support associated custom data
    - Traffic allocation is on a percentage scale or (0 -> 100)
    - Support to 2nd decimal precision, ex) 33.33

### Not in scope for this project
- Audience qualifcations
    - Integrator can select logic of when or the conditions of when to run experiment assignment
- Supporting multiple environments (dev/staging/prod)
    - Integrator (at least for now) can make sure to use different experiment configs themselves or such
- Supporting sticky (uniqueId, experimentName) => variatonName
    - Integrator can choose to maintain an external (uniqueId, experimentName) => variation name cache
- Does not (at least currently) support auto reloading/fetching the experiment config
    - Integrator can select/schedule the cadence at which they want to update their experiment config