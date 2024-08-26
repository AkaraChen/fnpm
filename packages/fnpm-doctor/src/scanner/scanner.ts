import type { Effect } from 'effect';

export type Scanner = (ctx: ScannerContext) => Effect.Effect<void>;

import fs, { promises as fsp } from 'node:fs';
import * as mt from '@akrc/monorepo-tools';
import path from 'pathe';

export type ScannerDiagnoseLevel = 'error' | 'warning' | 'info';

export interface ScannerDiagnose {
    level: ScannerDiagnoseLevel;
    title: string;
    description: string;
    docs?: string;
    workspace?: string[];
    scope?: string;
}

export interface ScannerContext {
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

    constructor(public cwd: string) {}

    async init() {
        this.root = await mt.findRepoRoot(this.cwd);
        this.pm = mt
            .detectPMByLock(this.root)
            .expect('Could not determine package manager');
        this.projects = await mt.scanProjects(this.root, this.pm);
    }

    report(...diagnoses: ScannerDiagnose[]) {
        this.diagnoses.push(...diagnoses);
    }
    resolve(filePath: string) {
        return path.resolve(this.root, filePath);
    }
    exists(filePath: string) {
        return fs.existsSync(filePath);
    }
    async file(filePath: string) {
        return fsp.readFile(filePath, 'utf-8');
    }
    async json<T>(jsonPath: string) {
        return JSON.parse(await this.file(jsonPath)) as T;
    }
}
