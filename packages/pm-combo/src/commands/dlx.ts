import parser from 'fnpm-parse';
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
                const parsed = parser.parse(pkg);
                return ['npx', '-p', pkg, '-y', '-c', parsed.fullName, ...args];
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
