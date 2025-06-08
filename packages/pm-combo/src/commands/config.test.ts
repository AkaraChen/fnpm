import { describe, expect, it } from 'vitest';
import { type ConfigOptions, config } from './config';

describe('config', () => {
    describe('list command', () => {
        it('should generate correct list command for npm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'list',
                global: true,
                json: true,
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'list',
                '--global',
                '--json',
            ]);
        });

        it('should generate correct list command for npm with project location', () => {
            const options: ConfigOptions = {
                verb: 'list',
                json: true,
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'list',
                '--location',
                'project',
                '--json',
            ]);
        });

        it('should generate correct list command for pnpm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'list',
                global: true,
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual(['pnpm', 'config', 'list', '--global']);
        });

        it('should generate correct list command for pnpm with project location', () => {
            const options: ConfigOptions = {
                verb: 'list',
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual([
                'pnpm',
                'config',
                'list',
                '--location',
                'project',
            ]);
        });

        it('should generate correct list command for yarn', () => {
            const options: ConfigOptions = {
                verb: 'list',
                global: true,
            };

            const result = config.concat('yarn', options);

            expect(result).toEqual(['yarn', 'config', '--global']);
        });
    });

    describe('get command', () => {
        it('should generate correct get command for npm', () => {
            const options: ConfigOptions = {
                verb: 'get',
                key: 'registry',
            };

            const result = config.concat('npm', options);

            expect(result).toEqual(['npm', 'get', 'registry']);
        });

        it('should generate correct get command for yarn-classic', () => {
            const options: ConfigOptions = {
                verb: 'get',
                key: 'registry',
            };

            const result = config.concat('yarn-classic', options);

            expect(result).toEqual(['yarn-classic', 'get', 'registry']);
        });
    });

    describe('set command', () => {
        it('should generate correct set command for npm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'set',
                key: 'registry',
                value: 'https://registry.npmjs.org/',
                global: true,
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'set',
                'registry',
                'https://registry.npmjs.org/',
                '--global',
            ]);
        });

        it('should generate correct set command for npm with project location', () => {
            const options: ConfigOptions = {
                verb: 'set',
                key: 'registry',
                value: 'https://registry.npmjs.org/',
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'set',
                'registry',
                'https://registry.npmjs.org/',
                '--location',
                'project',
            ]);
        });

        it('should generate correct set command for pnpm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'set',
                key: 'registry',
                value: 'https://registry.npmjs.org/',
                global: true,
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual([
                'pnpm',
                'config',
                'set',
                'registry',
                'https://registry.npmjs.org/',
                '--global',
            ]);
        });

        it('should generate correct set command for pnpm with project location', () => {
            const options: ConfigOptions = {
                verb: 'set',
                key: 'registry',
                value: 'https://registry.npmjs.org/',
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual([
                'pnpm',
                'config',
                'set',
                'registry',
                'https://registry.npmjs.org/',
                '--location',
                'project',
            ]);
        });

        it('should generate correct set command for yarn', () => {
            const options: ConfigOptions = {
                verb: 'set',
                key: 'registry',
                value: 'https://registry.npmjs.org/',
                global: true,
            };

            const result = config.concat('yarn', options);

            expect(result).toEqual([
                'yarn',
                'config',
                'set',
                'registry=https://registry.npmjs.org/',
                '--home',
            ]);
        });
    });

    describe('delete command', () => {
        it('should generate correct delete command for npm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'delete',
                key: 'registry',
                global: true,
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'delete',
                'registry',
                '--global',
            ]);
        });

        it('should generate correct delete command for npm with project location', () => {
            const options: ConfigOptions = {
                verb: 'delete',
                key: 'registry',
            };

            const result = config.concat('npm', options);

            expect(result).toEqual([
                'npm',
                'config',
                'delete',
                'registry',
                '--location',
                'project',
            ]);
        });

        it('should generate correct delete command for pnpm with global flag', () => {
            const options: ConfigOptions = {
                verb: 'delete',
                key: 'registry',
                global: true,
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual([
                'pnpm',
                'config',
                'delete',
                'registry',
                '--global',
            ]);
        });

        it('should generate correct delete command for pnpm with project location', () => {
            const options: ConfigOptions = {
                verb: 'delete',
                key: 'registry',
            };

            const result = config.concat('pnpm', options);

            expect(result).toEqual([
                'pnpm',
                'config',
                'delete',
                'registry',
                '--location',
                'project',
            ]);
        });

        it('should generate correct delete command for yarn', () => {
            const options: ConfigOptions = {
                verb: 'delete',
                key: 'registry',
                global: true,
            };

            const result = config.concat('yarn', options);

            expect(result).toEqual([
                'yarn',
                'config',
                'unset',
                'registry',
                '--home',
            ]);
        });
    });
});
