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
            case 'deno': {
                // Deno uses 'deno run' with npm: protocol
                // Example: deno run npm:cowsay@1.5.0 "Hello from Deno"
                const packageWithProtocol = pkg.includes(':')
                    ? pkg
                    : `npm:${pkg}`;
                return ['deno', 'run', packageWithProtocol, ...args];
            }
            case 'bun': {
                // Bun has 'bunx' similar to npx
                return ['bunx', pkg, ...args];
            }
        }
        return [pm, 'exec', pkg, ...args];
    },
};
