import { describe, expect, it } from 'vitest';
import yargs, { type ArgumentsCamelCase } from 'yargs';
import Add, { type AddCommandOptions } from './add';

type Args = ArgumentsCamelCase<AddCommandOptions>;

describe('Add Command', () => {
    it('should install packages', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBe(true);
            expect(options.saveDev).toBe(undefined);
            expect(options.saveExact).toBe(undefined);
            expect(options.savePeer).toBe(undefined);
            expect(options.saveOptional).toBe(undefined);
            expect(options.fixed).toBe(undefined);
            expect(options.workspace).toBe(undefined);
            expect(options.global).toBe(undefined);
        };
        await yargs(['add', 'foo']).command(cmd).parse();
    });
});
