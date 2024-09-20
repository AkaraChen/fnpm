import fs, { promises as fsp } from 'node:fs';
import { resolveContext } from '@/context';
import type * as mt from '@akrc/monorepo-tools';
import type { Effect } from 'effect';
import path from 'pathe';

export type Scanner = (ctx: ScannerContext) => Effect.Effect<void>;

export type ScannerDiagnoseLevel = 'error' | 'warning' | 'info';

export interface ScannerDiagnose {
    id: string;
    level: ScannerDiagnoseLevel;
    title: string;
    description: string;
    docs?: URL;
    workspace?: string[];
    scope?: string;
}

interface ScannerContext {
    cwd: string;
    root: string;
    diagnoses: ScannerDiagnose[];
    report(...diagnoses: ScannerDiagnose[]): void;
    pm: mt.PM;
    projects: Awaited<ReturnType<typeof mt.scanProjects>>;
    resolve(filePath: string): string;
    exists(filePath: string): boolean;
    file(filePath: string): Promise<string>;
    json<T>(jsonPath: string): Promise<T>;
}

export class ScannerContextImpl implements ScannerContext {
    diagnoses: ScannerDiagnose[] = [];
    pm!: mt.PM;
    projects!: Awaited<ReturnType<typeof mt.scanProjects>>;
    root!: string;
    isMonoRepo!: boolean;

    constructor(public cwd: string) {}

    async init(): Promise<void> {
        const rawContext = await resolveContext(this.cwd);
        this.root = rawContext.root;
        this.pm = rawContext.pm;
        this.projects = rawContext.projects;
        this.isMonoRepo = rawContext.isMonoRepo;
    }

    report(diagnose: ScannerDiagnose): void {
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
