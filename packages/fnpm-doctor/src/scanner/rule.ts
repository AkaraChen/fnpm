import fs, { promises as fsp } from 'node:fs';
import { resolveContext } from '@/context';
import type * as mt from '@akrc/monorepo-tools';
import type { Effect } from 'effect';
import path from 'pathe';

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
    resolve(filePath: string): string;
    exists(filePath: string): boolean;
    file(filePath: string): Promise<string>;
    json<T>(jsonPath: string): Promise<T>;
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
    resolve(filePath: string): string {
        return path.resolve(this.root, filePath);
    }
    exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }
    async file(filePath: string): Promise<string> {
        return fsp.readFile(filePath, 'utf-8');
    }
    async json<T>(jsonPath: string): Promise<T> {
        return JSON.parse(await this.file(jsonPath)) as T;
    }
}
