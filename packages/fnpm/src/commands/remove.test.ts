import { describe, expect, it } from 'vitest';
import yargs from 'yargs';
import { factory } from '../../tests/utils';
import Remove from './remove';

describe('Remove Command', () => {
    it('should remove packages', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveDev).toBeFalsy();
            expect(options.savePeer).toBeFalsy();
            expect(options.saveOptional).toBeFalsy();
            expect(options.global).toBeFalsy();
        };
        await yargs(['remove', 'foo']).command(cmd).parse();
    });

    it('should handle multiple packages', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo', 'bar', 'baz']);
            expect(options.save).toBeUndefined();
        };
        await yargs(['remove', 'foo', 'bar', 'baz']).command(cmd).parse();
    });

    it('should handle --save flag', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBe(true);
            expect(options.saveDev).toBeFalsy();
            expect(options.savePeer).toBeFalsy();
            expect(options.saveOptional).toBeFalsy();
            expect(options.global).toBeFalsy();
        };
        await yargs(['remove', 'foo', '--save']).command(cmd).parse();
    });

    it('should handle -S alias for --save', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBe(true);
            expect(options.saveDev).toBeFalsy();
        };
        await yargs(['remove', 'foo', '-S']).command(cmd).parse();
    });

    it('should handle --save-dev flag', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveDev).toBe(true);
        };
        await yargs(['remove', 'foo', '--save-dev']).command(cmd).parse();
    });

    it('should handle -D alias for --save-dev', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveDev).toBe(true);
        };
        await yargs(['remove', 'foo', '-D']).command(cmd).parse();
    });

    it('should handle --save-peer flag', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.savePeer).toBe(true);
        };
        await yargs(['remove', 'foo', '--save-peer']).command(cmd).parse();
    });

    it('should handle -P alias for --save-peer', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.savePeer).toBe(true);
        };
        await yargs(['remove', 'foo', '-P']).command(cmd).parse();
    });

    it('should handle --save-optional flag', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveOptional).toBe(true);
        };
        await yargs(['remove', 'foo', '--save-optional']).command(cmd).parse();
    });

    it('should handle -O alias for --save-optional', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.saveOptional).toBe(true);
        };
        await yargs(['remove', 'foo', '-O']).command(cmd).parse();
    });

    it('should handle --global flag', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.global).toBe(true);
        };
        await yargs(['remove', 'foo', '--global']).command(cmd).parse();
    });

    it('should handle -G alias for --global', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
            expect(options.save).toBeUndefined();
            expect(options.global).toBe(true);
        };
        await yargs(['remove', 'foo', '-G']).command(cmd).parse();
    });

    it('should handle rm alias', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
        };
        await yargs(['rm', 'foo']).command(cmd).parse();
    });

    it('should handle uninstall alias', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
        };
        await yargs(['uninstall', 'foo']).command(cmd).parse();
    });

    it('should handle un alias', async () => {
        const cmd = factory.create(Remove);
        cmd.handler = async (options) => {
            expect(options.packages).toEqual(['foo']);
        };
        await yargs(['un', 'foo']).command(cmd).parse();
    });

    it('should not handle combined flags', async () => {
        expect(() =>
            yargs(['remove', 'pkg1', 'pkg2', '-D', '--save-exact', '-G'])
                .command(factory.create(Remove))
                .parse()
        ).toThrow();
    });

    it('should not handle save with save-dev', async () => {
        expect(() =>
            yargs(['remove', 'pkg1', '--save', '--save-dev'])
                .command(factory.create(Remove))
                .parse()
        ).toThrow();
    });
});
