import { performance } from 'perf_hooks';

export function stopwatch(cb) {
    const isValidCallback = typeof cb === 'function';
    const startTime = performance.now();

    const result = isValidCallback ?
        cb() : null;
    const totalTimeInMs = isValidCallback ?
        performance.now() - startTime : -1;

    return {
        result,
        totalTimeInMs,
    };
}