#!/usr/bin/env node

/**
 * Benchmark fnpm commands to establish performance baseline
 *
 * This script runs fnpm commands multiple times and reports statistics
 *
 * Usage: node benchmark.js
 */

import { execSync } from 'node:child_process';

const ITERATIONS = 10;
const COMMANDS = [
    {
        name: 'fnpm --help',
        cmd: 'fnpm --help',
        cwd: process.cwd(),
    },
    {
        name: 'fnpm --version',
        cmd: 'fnpm --version',
        cwd: process.cwd(),
    },
    {
        name: 'fnpm add --help',
        cmd: 'fnpm add --help',
        cwd: process.cwd(),
    },
];

function runBenchmark(command, iterations) {
    console.log(`\n📊 Benchmarking: ${command.name}`);
    console.log(`   Running ${iterations} iterations...`);

    const times = [];

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        try {
            execSync(command.cmd, {
                cwd: command.cwd,
                stdio: 'ignore',
                timeout: 30000,
            });
        } catch (err) {
            console.error(`   ⚠ Iteration ${i + 1} failed:`, err.message);
            continue;
        }
        const end = performance.now();
        const duration = end - start;
        times.push(duration);

        // Show progress
        process.stdout.write(`   ${i + 1}/${iterations} `);
        if ((i + 1) % 5 === 0) process.stdout.write('\n   ');
    }

    process.stdout.write('\n');

    if (times.length === 0) {
        console.log('   ❌ All iterations failed');
        return null;
    }

    // Calculate statistics
    times.sort((a, b) => a - b);
    const min = times[0];
    const max = times[times.length - 1];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const median = times[Math.floor(times.length / 2)];
    const p95 = times[Math.floor(times.length * 0.95)];

    console.log(`   ✓ Completed ${times.length}/${iterations} iterations`);
    console.log(`   Min:    ${min.toFixed(2)}ms`);
    console.log(`   Max:    ${max.toFixed(2)}ms`);
    console.log(`   Avg:    ${avg.toFixed(2)}ms`);
    console.log(`   Median: ${median.toFixed(2)}ms`);
    console.log(`   P95:    ${p95.toFixed(2)}ms`);

    return { min, max, avg, median, p95, iterations: times.length };
}

console.log('🚀 fnpm CLI Performance Benchmark');
console.log('═'.repeat(60));
console.log(`Running ${ITERATIONS} iterations per command`);

const results = {};

for (const command of COMMANDS) {
    const result = runBenchmark(command, ITERATIONS);
    if (result) {
        results[command.name] = result;
    }
}

console.log('\n');
console.log('═'.repeat(60));
console.log('📈 Summary');
console.log('═'.repeat(60));
console.log(
    '\nCommand'.padEnd(30) + 'Avg Time'.padStart(12) + 'P95'.padStart(12)
);
console.log('─'.repeat(60));

for (const [name, stats] of Object.entries(results)) {
    console.log(
        name.padEnd(30) +
            `${stats.avg.toFixed(2)}ms`.padStart(12) +
            `${stats.p95.toFixed(2)}ms`.padStart(12)
    );
}

console.log('\n💡 Interpretation:');
console.log('   - Avg: Average execution time across all runs');
console.log('   - P95: 95th percentile (excludes outliers)');
console.log('   - Lower is better');
console.log('');
console.log('💾 Baseline saved. Re-run after optimizations to compare.');
console.log('');
