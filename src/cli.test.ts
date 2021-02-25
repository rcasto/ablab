import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

async function runCliWithArgs(...args: string[]) {
    // https://github.com/TypeStrong/ts-node/issues/1007#issue-598417180
    const cmd = `node --loader ts-node/esm src/cli.ts ${args.join(' ')}`;

    const {
        stderr,
        stdout,
    } = await execPromise(cmd);

    return {
        stderr,
        stdout,
    };
}

describe('lab cli tests', () => {

    it('can handle no args provided', async () => {
        try {
            await runCliWithArgs();

            // This shouldn't be reached
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err.code).toEqual(1);
            expect(err.stdout).toEqual('');
            expect(err.stderr).not.toEqual('');
        }
    });

    it('can handle case where only 1 arg (instead of 2) is provided', async () => {
        try {
            await runCliWithArgs('fake-command');

            // This shouldn't be reached
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err.code).toEqual(1);
            expect(err.stdout).toEqual('');
            expect(err.stderr).not.toEqual('');
        }
    });

    it('can handle case where at given experiment config path does not exist', async () => {
        try {
            await runCliWithArgs('fake-command', 'fake-experiment-config-path');

            // This shouldn't be reached
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err.code).toEqual(1);
            expect(err.stdout).toEqual('');
            expect(err.stderr).not.toEqual('');
        }
    });

    it('can handle case where at given command is invalid', async () => {
        try {
            await runCliWithArgs('fake-command', 'test_experiment_config.json');

            // This shouldn't be reached
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err.code).toEqual(1);
            expect(err.stdout).toEqual('');
            expect(err.stderr).not.toEqual('');
        }
    });

    it('can validate experiment config', async () => {
        try {
            const {
                stderr,
                stdout
            } = await runCliWithArgs('validate', 'test_experiment_config.json');

            expect(stdout).not.toEqual('');
        } catch (err) {
            console.error(err);

            // This shouldn't be reached
            expect(true).toBeFalsy();
        }
    });
});