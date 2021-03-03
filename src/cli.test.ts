import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';

const execPromise = promisify(exec);

const sampleConfigsDirectoryPath = path.resolve('sample-configs');
const nonJSONExperimentConfigPath = path.resolve(sampleConfigsDirectoryPath, 'invalid-experiment-config.txt');
const validExperimentConfigPath = path.resolve(sampleConfigsDirectoryPath, 'simple-valid-experiment-config.json');

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

    describe('cli error scenarios', () => {
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
    
        it('can handle case where given experiment config path does not point to valid JSON', async () => {
            try {
                await runCliWithArgs('fake-command', nonJSONExperimentConfigPath);
    
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
                await runCliWithArgs('fake-command', validExperimentConfigPath);
    
                // This shouldn't be reached
                expect(true).toBeFalsy();
            } catch (err) {
                expect(err.code).toEqual(1);
                expect(err.stdout).toEqual('');
                expect(err.stderr).not.toEqual('');
            }
        });
    });

    describe('validate cli command tests', () => {
        it('can validate experiment config - no errors', async () => {
            try {
                const {
                    stdout
                } = await runCliWithArgs('validate', validExperimentConfigPath);
    
                expect(stdout).toEqual('{}\n');
            } catch (err) {
                // This shouldn't be reached
                expect(true).toBeFalsy();
            }
        });
    });
});