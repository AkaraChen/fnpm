import type { Project } from '@pnpm/types';
import { Effect } from 'effect';
import { getDeps } from 'fnpm-toolkit';
import type {
    DocumentedModuleReplacement,
    ModuleReplacement,
    NativeModuleReplacement,
    SimpleModuleReplacement,
} from 'module-replacements';
import microUtilsReplacements from 'module-replacements/manifests/micro-utilities.json';
import nativeReplacements from 'module-replacements/manifests/native.json';
import preferredReplacements from 'module-replacements/manifests/preferred.json';
import type { PackageJson } from 'type-fest';
import type { Rule, RuleContext } from '../rule';

function createRule<T extends ModuleReplacement>(
    replacements: T[],
    reporter: (replacement: T, ctx: RuleContext, project: Project) => void,
): Rule {
    return (ctx) =>
        Effect.sync(() => {
            for (const project of ctx.projects) {
                const deps = getDeps(project.manifest as PackageJson);
                for (const replacement of replacements) {
                    if (deps.includes(replacement.moduleName)) {
                        reporter(replacement, ctx, project);
                    }
                }
            }
        });
}

export const nativeReplacementRule: Rule = createRule(
    nativeReplacements.moduleReplacements as NativeModuleReplacement[],
    (replacement, ctx, project) => {
        ctx.report({
            id: `native-module-${replacement.moduleName}`,
            title: `Native module ${replacement.moduleName} is used`,
            description: `The module ${replacement.moduleName} is a native module and has a replacement. You should consider using ${replacement.replacement} instead.`,
            level: 'warning',
            docs: new URL(
                replacement.mdnPath,
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/',
            ),
            scope: 'native-module',
            workspace: [project.manifest.name!],
        });
    },
);

export const microUtilsReplacementRule: Rule = createRule(
    microUtilsReplacements.moduleReplacements as SimpleModuleReplacement[],
    (replacement, ctx, project) => {
        ctx.report({
            id: `micro-utils-module-${replacement.moduleName}`,
            title: `Micro utils module ${replacement.moduleName} is used`,
            description: `The module ${replacement.moduleName} is a micro utils module and has a replacement. You should consider using ${replacement.replacement} instead.`,
            level: 'warning',
            scope: 'micro-utils-module',
            workspace: [project.manifest.name!],
        });
    },
);

export const preferredReplacementRule: Rule = createRule(
    preferredReplacements.moduleReplacements as DocumentedModuleReplacement[],
    (replacement, ctx, project) => {
        ctx.report({
            id: `preferred-module-${replacement.moduleName}`,
            title: `Not recommended module ${replacement.moduleName} is used`,
            description: `The module ${replacement.moduleName} is not a recommended module and has a replacement. You should see the documentation at ${replacement.docPath}.`,
            level: 'info',
            docs: new URL(
                `${replacement.docPath}.md`,
                'https://github.com/es-tooling/module-replacements/blob/main/docs/modules/',
            ),
            scope: 'preferred-module',
            workspace: [project.manifest.name!],
        });
    },
);
