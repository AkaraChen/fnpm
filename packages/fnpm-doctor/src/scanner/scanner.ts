import type { Effect } from 'effect';

export type Scanner = (ctx: ScannerContext) => Effect.Effect<void>;

import fs, { promises as fsp } from 'node:fs';
import type * as mt from '@akrc/monorepo-tools';
import path from 'pathe';
import { resolveContext } from '../context';

export type ScannerDiagnoseLevel = 'error' | 'warning' | 'info';

export interface ScannerDiagnose {
    level: ScannerDiagnoseLevel;
    title: string;
    description: string;
    docs?: string;
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

    report(...diagnoses: ScannerDiagnose[]): void {
        this.diagnoses.push(...diagnoses);
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
