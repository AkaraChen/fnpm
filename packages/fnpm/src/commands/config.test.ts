import { describe, expect, it } from 'vitest';
import yargs, { type ArgumentsCamelCase } from 'yargs';
import { factory } from '../../tests/utils';
import Config, { type ConfigCommandOptions } from './config';

type Args = ArgumentsCamelCase<ConfigCommandOptions>;

describe('Config Command', () => {
    it('should default to list verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('list');
            expect(options.key).toBeUndefined();
            expect(options.value).toBeUndefined();
            expect(options.global).toBeUndefined();
            expect(options.json).toBeUndefined();
        };
        await yargs(['config']).command(cmd).parse();
    });

    it('should handle list verb with --json', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('list');
            expect(options.json).toBe(true);
        };
        await yargs(['config', 'list', '--json']).command(cmd).parse();
    });

    it('should handle ls alias for list verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('ls');
        };
        await yargs(['config', 'ls']).command(cmd).parse();
    });

    it('should handle get <key> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('get');
            expect(options.key).toBe('foo');
            expect(options.value).toBeUndefined();
            expect(options.global).toBeUndefined();
            expect(options.json).toBeUndefined();
        };
        await yargs(['config', 'get', 'foo']).command(cmd).parse();
    });

    it('should handle g alias for get <key> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('g');
            expect(options.key).toBe('foo');
        };
        await yargs(['config', 'g', 'foo']).command(cmd).parse();
    });

    it('should handle get <key> --global verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('get');
            expect(options.key).toBe('foo');
            expect(options.global).toBe(true);
        };
        await yargs(['config', 'get', 'foo', '--global']).command(cmd).parse();
    });

    it('should handle get <key> -G alias for --global verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('get');
            expect(options.key).toBe('foo');
            expect(options.global).toBe(true);
        };
        await yargs(['config', 'get', 'foo', '-G']).command(cmd).parse();
    });

    it('should handle set <key> <value> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('set');
            expect(options.key).toBe('foo');
            expect(options.value).toBe('bar');
            expect(options.global).toBeUndefined();
            expect(options.json).toBeUndefined();
        };
        await yargs(['config', 'set', 'foo', 'bar']).command(cmd).parse();
    });

    it('should handle s alias for set <key> <value> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('s');
            expect(options.key).toBe('foo');
            expect(options.value).toBe('bar');
        };
        await yargs(['config', 's', 'foo', 'bar']).command(cmd).parse();
    });

    it('should handle delete <key> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('delete');
            expect(options.key).toBe('foo');
            expect(options.value).toBeUndefined();
            expect(options.global).toBeUndefined();
            expect(options.json).toBeUndefined();
        };
        await yargs(['config', 'delete', 'foo']).command(cmd).parse();
    });

    it('should handle rm alias for delete <key> verb', async () => {
        const cmd = factory.create(Config);
        cmd.handler = async (options: Args) => {
            expect(options.verb).toBe('rm');
            expect(options.key).toBe('foo');
        };
        await yargs(['config', 'rm', 'foo']).command(cmd).parse();
    });
});
