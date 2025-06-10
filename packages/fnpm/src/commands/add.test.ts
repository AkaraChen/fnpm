import { describe, expect, it } from 'vitest';
import yargs, { type ArgumentsCamelCase } from 'yargs';
import Add, { type AddCommandOptions } from './add';

type Args = ArgumentsCamelCase<AddCommandOptions>;

describe('Add Command', () => {
    it('should install packages', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveDev).toBeFalsy();
            expect(options.saveExact).toBeFalsy();
            expect(options.savePeer).toBeFalsy();
            expect(options.saveOptional).toBeFalsy();
            expect(options.fixed).toBeFalsy();
            expect(options.workspace).toBeFalsy();
            expect(options.global).toBeFalsy();
        };
        await yargs(['add', 'foo']).command(cmd).parse();
    });

    it('should handle multiple packages', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo', 'bar', 'baz']);
            expect(options.save).toBeUndefined();
        };
        await yargs(['add', 'foo', 'bar', 'baz']).command(cmd).parse();
    });

    it('should handle --save-dev flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined(); // options.save defaults to true. yargs passes it as true even if saveDev is also true, if handler is called despite conflict.
            expect(options.saveDev).toBe(true);
        };
        await yargs(['add', 'foo', '--save-dev']).command(cmd).parse();
    });

    it('should handle -D alias for --save-dev', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveDev).toBe(true);
        };
        await yargs(['add', 'foo', '-D']).command(cmd).parse();
    });

    it('should handle --save-exact flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveExact).toBe(true);
        };
        await yargs(['add', 'foo', '--save-exact']).command(cmd).parse();
    });

    it('should handle -E alias for --save-exact', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveExact).toBe(true);
        };
        await yargs(['add', 'foo', '-E']).command(cmd).parse();
    });

    it('should handle --save-peer flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.savePeer).toBe(true);
        };
        await yargs(['add', 'foo', '--save-peer']).command(cmd).parse();
    });

    it('should handle -P alias for --save-peer', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.savePeer).toBe(true);
        };
        await yargs(['add', 'foo', '-P']).command(cmd).parse();
    });

    it('should handle --save-optional flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveOptional).toBe(true);
        };
        await yargs(['add', 'foo', '--save-optional']).command(cmd).parse();
    });

    it('should handle -O alias for --save-optional', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveOptional).toBe(true);
        };
        await yargs(['add', 'foo', '-O']).command(cmd).parse();
    });

    it('should handle --fixed flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.fixed).toBe(true);
        };
        await yargs(['add', 'foo', '--fixed']).command(cmd).parse();
    });

    it('should handle -F alias for --fixed', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.fixed).toBe(true);
        };
        await yargs(['add', 'foo', '-F']).command(cmd).parse();
    });

    it('should handle --workspace flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.workspace).toBe(true);
        };
        await yargs(['add', 'foo', '--workspace']).command(cmd).parse();
    });

    it('should handle -W alias for --workspace', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.workspace).toBe(true);
        };
        await yargs(['add', 'foo', '-W']).command(cmd).parse();
    });

    it('should handle --global flag', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined(); // options.save defaults to true. yargs passes it as true even if global is also true, if handler is called despite conflict.
            expect(options.global).toBe(true);
        };
        await yargs(['add', 'foo', '--global']).command(cmd).parse();
    });

    it('should handle -G alias for --global', async () => {
        const cmd = new Add();
        cmd.handler = async (options: Args) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.global).toBe(true);
        };
        await yargs(['add', 'foo', '-G']).command(cmd).parse();
    });

    it('should not handle combined flags', async () => {
        expect(() =>
            yargs(['add', 'pkg1', 'pkg2', '-D', '--save-exact', '-G'])
                .command(new Add())
                .parse(),
        ).toThrow();
    });
});
