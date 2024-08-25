import { Effect } from 'effect';
import type { Scanner } from './scanner';

export const versionMismatch: Scanner = (ctx) => {
    return Effect.sync(() => {
        const versionMap = new Map<string, Set<string>>();
        for (const project of ctx.projects) {
            const { manifest } = project;
            const fields = [
                'dependencies',
                'devDependencies',
                'peerDependencies',
                'optionalDependencies',
            ] as Array<keyof typeof manifest>;
            for (const field of fields) {
                const dependencies = manifest[field] as
                    | Record<string, string>
                    | undefined;
                if (dependencies) {
                    for (const [name, version] of Object.entries(
                        dependencies,
                    )) {
                        const versions = versionMap.get(name) || new Set();
                        versions.add(version);
                        versionMap.set(name, versions);
                    }
                }
            }
        }
        for (const [name, versions] of versionMap.entries()) {
            if (versions.size > 1) {
                ctx.report({
                    level: 'error',
                    title: 'Version mismatch',
                    description: `Version mismatch for ${name}: ${Array.from(versions).join(', ')}`,
                    scope: 'dependencies',
                });
            }
        }
    });
};
