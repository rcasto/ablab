# experisimple
The goal of this project is to be a simple library for enabling experimentation.
You choose the location to host the experimentation config and supply a unique id (optional) to use for bucketing.

This library primarily offers the bucketing and the schema for definining experiments via config.

## Scope
- Configuration should support
    - Multiple experiments
    - Turn experiment on/off
    - Specifying traffic allocation
    - Specifying variations A/B/C/.... and their percentages
        - Should variations be able to be custom named?

## Not in scope
- Audience qualifcations
    - Integrators/consumers can do this in their own code before experiment assignment
- Custom variables associated with variations not supported at least in initial version
    - May want to think through or open up possibility
- Supporting multiple environments (dev/staging/prod)
    - Developer can make sure to use different experiment configs themselves or such
- Supporting sticky (uniqueId, experimentName) => variatonName
    - Useful if during experiment run, traffic is dialed back ex) 50% -> 25% or such