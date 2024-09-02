import { Effect } from 'effect';
import { getDeps } from 'fnpm-toolkit';
import {
    type DocumentedModuleReplacement,
    type NativeModuleReplacement,
    type SimpleModuleReplacement,
    microUtilsReplacements,
    nativeReplacements,
    preferredReplacements,
} from 'module-replacements';
import type { PackageJson } from 'read-pkg';
import type { Scanner } from './scanner';

export const moduleReplacement: Scanner = (ctx) => {
    return Effect.promise(async () => {
        for (const project of ctx.projects) {
            const deps = getDeps(project.manifest as PackageJson);
            for (const native of nativeReplacements.moduleReplacements as NativeModuleReplacement[]) {
                if (deps.includes(native.moduleName)) {
                    ctx.report({
                        id: `native-module-${native.moduleName}`,
                        title: `Native module ${native.moduleName} is used`,
                        description: `The module ${native.moduleName} is a native module and has a replacement. You should consider using ${native.replacement} instead.`,
                        level: 'warning',
                        docs: new URL(
                            native.mdnPath,
                            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/',
                        ),
                        scope: 'native-module',
                        workspace: [project.manifest.name!],
                    });
                }
            }
            for (const micro of microUtilsReplacements.moduleReplacements as SimpleModuleReplacement[]) {
                if (deps.includes(micro.moduleName)) {
                    ctx.report({
                        id: `micro-utils-module-${micro.moduleName}`,
                        title: `Micro utils module ${micro.moduleName} is used`,
                        description: `The module ${micro.moduleName} is a micro utils module and has a replacement. You should consider using ${micro.replacement} instead.`,
                        level: 'warning',
                        scope: 'micro-utils-module',
                        workspace: [project.manifest.name!],
                    });
                }
            }
            for (const preferred of preferredReplacements.moduleReplacements as DocumentedModuleReplacement[]) {
                if (deps.includes(preferred.moduleName)) {
                    ctx.report({
                        id: `preferred-module-${preferred.moduleName}`,
                        title: `Not recommended module ${preferred.moduleName} is used`,
                        description: `The module ${preferred.moduleName} is not a recommended module and has a replacement. You should see the documentation at ${preferred.docPath}.`,
                        level: 'info',
                        docs: new URL(
                            `${preferred.docPath}.md`,
                            'https://github.com/es-tooling/module-replacements/blob/main/docs/modules/',
                        ),
                        scope: 'preferred-module',
                        workspace: [project.manifest.name!],
                    });
                }
            }
        }
    });
};
