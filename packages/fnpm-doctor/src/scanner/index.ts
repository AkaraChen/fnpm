import { Effect } from 'effect';
import { type Diagnose, type Rule, RuleContextImpl } from './rule';
import {
    microUtilsReplacementRule,
    nativeReplacementRule,
    preferredReplacementRule,
} from './rules/module-replacement';
import { multipleEslintConfig } from './rules/multiple-eslint-config';
import { publint } from './rules/publint';
import { versionMismatch } from './rules/version-mismatch';

const rules: Rule[] = [
    multipleEslintConfig,
    versionMismatch,
    publint,
    nativeReplacementRule,
    preferredReplacementRule,
    microUtilsReplacementRule,
];

export interface ScanResult {
    diagnoses: Diagnose[];
}

export async function scan(searchDir: string): Promise<ScanResult> {
    const context = new RuleContextImpl(searchDir);
    await context.init();
    await Effect.runPromise(Effect.forEach(rules, (rule) => rule(context)));
    return {
        diagnoses: context.diagnoses,
    };
}
