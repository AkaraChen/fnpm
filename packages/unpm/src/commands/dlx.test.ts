import { describe, expect, it } from 'vitest';
import { type DlxOptions, dlx } from './dlx';

describe('dlx', () => {
    it('should return the correct command for npm', () => {
        const options: DlxOptions = {
            package: 'my-package',
            args: ['--flag1', '--flag2'],
        };
        const result = dlx.concat('npm', options);
        expect(result).toEqual([
            'npx',
            '-p',
            'my-package',
            '-y',
            '-c',
            'my-package',
            '--flag1',
            '--flag2',
        ]);
    });

    it('should return the correct command for yarn', () => {
        const options: DlxOptions = {
            package: 'my-package',
            args: ['--flag1', '--flag2'],
        };
        const result = dlx.concat('yarn', options);
        expect(result).toEqual([
            'yarn',
            'dlx',
            'my-package',
            '--flag1',
            '--flag2',
        ]);
    });

    it('should return the correct command for pnpm', () => {
        const options: DlxOptions = {
            package: 'my-package',
            args: ['--flag1', '--flag2'],
        };
        const result = dlx.concat('pnpm', options);
        expect(result).toEqual(['pnpx', 'my-package', '--flag1', '--flag2']);
    });
});
