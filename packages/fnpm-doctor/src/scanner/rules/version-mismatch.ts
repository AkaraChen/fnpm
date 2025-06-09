import { Effect } from 'effect';
import { traverseDepsField } from 'fnpm-toolkit';
import type { PackageJson } from 'read-pkg';
import type { Rule } from '../rule';

interface VersionMap {
    workspace: string;
    version: string;
}

export const versionMismatch: Rule = (ctx) => {
    return Effect.sync(() => {
        const versionMap = new Map<string, VersionMap[]>();
        for (const project of ctx.projects) {
            traverseDepsField(
                project.manifest as PackageJson,
                (dependencies) => {
                    for (const [name, version] of Object.entries(
                        dependencies,
                    )) {
                        const versions =
                            versionMap.get(name) || ([] as VersionMap[]);
                        versions.push({
                            workspace: project.manifest.name!,
                            version,
                        });
                        versionMap.set(name, versions);
                    }
                },
            );
        }
        for (const [name, versions] of versionMap.entries()) {
            const hasMismatch =
                new Set(versions.map((v) => v.version)).size > 1;
            if (hasMismatch) {
                ctx.report({
                    id: `version-mismatch-${name}`,
                    level: 'error',
                    title: `${name} version mismatch`,
                    description: `Version mismatch for ${name}: ${Array.from(
                        versions,
                    )
                        .map((v) => v.workspace)
                        .join(', ')}`,
                    scope: 'dependencies',
                    workspace: Array.from(versions).map((v) => v.workspace),
                });
            }
        }
    });
};
