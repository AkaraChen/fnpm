import npa from 'npm-package-arg';
import type { Command } from './type';

export interface DlxOptions {
    package: string;
    args?: string[];
}

export const dlx: Command<DlxOptions> = {
    concat(pm, options): string[] {
        const { package: pkg, args = [] } = options;
        switch (pm) {
            case 'npm': {
                const parsed = npa(pkg);
                return ['npx', '-p', pkg, '-y', '-c', parsed.name!, ...args];
            }
            case 'yarn': {
                return ['yarn', 'dlx', pkg, ...args];
            }
            case 'pnpm': {
                return ['pnpx', pkg, ...args];
            }
        }
        return [pm, 'exec', pkg, ...args];
    },
};
