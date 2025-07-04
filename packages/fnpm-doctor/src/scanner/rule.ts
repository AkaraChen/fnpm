import type * as mt from '@akrc/monorepo-tools';
import type { Effect } from 'effect';
import { resolveContext } from 'fnpm-context';

export type Rule = (ctx: RuleContext) => Effect.Effect<void>;

export type DiagnoseLevel = 'error' | 'warning' | 'info';

export interface Diagnose {
    id: string;
    level: DiagnoseLevel;
    title: string;
    description: string;
    docs?: URL;
    workspace?: string[];
    scope?: string;
}

export interface RuleContext {
    cwd: string;
    root: string;
    diagnoses: Diagnose[];
    report(...diagnoses: Diagnose[]): void;
    pm: mt.PM;
    projects: Awaited<ReturnType<typeof mt.scanProjects>>;
}

export class RuleContextImpl implements RuleContext {
    diagnoses: Diagnose[] = [];
    pm!: mt.PM;
    projects!: Awaited<ReturnType<typeof mt.scanProjects>>;
    root!: string;
    isMonoRepo!: boolean;
    cwd: string;

    constructor(cwd: string) {
        this.cwd = cwd;
    }

    async init(): Promise<void> {
        const rawContext = await resolveContext(this.cwd);
        this.root = rawContext.root;
        this.pm = rawContext.pm;
        if (!('projects' in rawContext)) {
            throw new Error('projects not found');
        }
        this.projects = rawContext.projects;
        this.isMonoRepo = rawContext.isMonoRepo;
    }

    report(diagnose: Diagnose): void {
        const existing = this.diagnoses.find((d) => d.id === diagnose.id);
        if (existing) {
            this.diagnoses[this.diagnoses.indexOf(existing)] = {
                ...existing,
                workspace: [
                    ...(existing.workspace || []),
                    ...(diagnose.workspace || []),
                ],
            };
        } else {
            this.diagnoses.push(diagnose);
        }
    }
}
