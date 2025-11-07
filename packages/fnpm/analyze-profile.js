#!/usr/bin/env node

/**
 * Analyze CPU profile and show hotspots
 *
 * Usage: node analyze-profile.js <profile-file.cpuprofile>
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const profilePath = process.argv[2];
if (!profilePath) {
    console.error('Usage: node analyze-profile.js <profile-file.cpuprofile>');
    process.exit(1);
}

try {
    const profileData = JSON.parse(readFileSync(profilePath, 'utf-8'));

    console.log('\n📊 CPU Profile Analysis\n');
    console.log('Profile:', basename(profilePath));
    console.log(
        'Duration:',
        ((profileData.endTime - profileData.startTime) / 1000).toFixed(2),
        'ms'
    );
    console.log('');

    // Analyze nodes
    const { nodes } = profileData;

    // Calculate self times for each function
    const functionStats = new Map();

    for (const node of nodes) {
        const functionName = node.callFrame.functionName || '(anonymous)';
        const url = node.callFrame.url || '';
        const lineNumber = node.callFrame.lineNumber || 0;
        const key = `${functionName}@${url}:${lineNumber}`;

        if (!functionStats.has(key)) {
            functionStats.set(key, {
                name: functionName,
                url,
                line: lineNumber,
                selfTime: 0,
                totalTime: 0,
                hitCount: node.hitCount || 0,
            });
        } else {
            const stats = functionStats.get(key);
            stats.hitCount += node.hitCount || 0;
        }
    }

    // Calculate times based on sample data
    const samples = profileData.samples || [];
    const timeDeltas = profileData.timeDeltas || [];

    for (let i = 0; i < samples.length; i++) {
        const nodeId = samples[i];
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
            const timeDelta = timeDeltas[i] || 0;
            const functionName = node.callFrame.functionName || '(anonymous)';
            const url = node.callFrame.url || '';
            const lineNumber = node.callFrame.lineNumber || 0;
            const key = `${functionName}@${url}:${lineNumber}`;

            const stats = functionStats.get(key);
            if (stats) {
                stats.selfTime += timeDelta;
            }
        }
    }

    // Sort by self time
    const sortedFunctions = Array.from(functionStats.values())
        .filter((f) => f.selfTime > 0)
        .sort((a, b) => b.selfTime - a.selfTime);

    console.log('🔥 Top 20 Hotspots (by self time):\n');
    console.log('Rank | Self Time | Function | Location');
    console.log('─'.repeat(100));

    sortedFunctions.slice(0, 20).forEach((func, index) => {
        const selfTimeMs = (func.selfTime / 1000).toFixed(2);
        const percentage = (
            (func.selfTime / (profileData.endTime - profileData.startTime)) *
            100
        ).toFixed(1);
        const location = func.url
            ? `${basename(func.url)}:${func.line}`
            : '(native)';

        console.log(
            `${(index + 1).toString().padStart(4)} | ` +
                `${selfTimeMs.padStart(9)}ms (${percentage.padStart(5)}%) | ` +
                `${func.name.slice(0, 40).padEnd(40)} | ` +
                location
        );
    });

    // Find fnpm-specific functions
    console.log('\n\n📦 fnpm-specific hotspots:\n');
    console.log('Rank | Self Time | Function | Location');
    console.log('─'.repeat(100));

    const fnpmFunctions = sortedFunctions
        .filter(
            (f) =>
                f.url &&
                (f.url.includes('/fnpm/') ||
                    f.url.includes('fnpm-') ||
                    f.url.includes('/packages/'))
        )
        .slice(0, 20);

    if (fnpmFunctions.length === 0) {
        console.log('No fnpm-specific functions found in hotspots');
    } else {
        fnpmFunctions.forEach((func, index) => {
            const selfTimeMs = (func.selfTime / 1000).toFixed(2);
            const percentage = (
                (func.selfTime /
                    (profileData.endTime - profileData.startTime)) *
                100
            ).toFixed(1);
            const location = func.url
                ? `${basename(func.url)}:${func.line}`
                : '(native)';

            console.log(
                `${(index + 1).toString().padStart(4)} | ` +
                    `${selfTimeMs.padStart(9)}ms (${percentage.padStart(5)}%) | ` +
                    `${func.name.slice(0, 40).padEnd(40)} | ` +
                    location
            );
        });
    }

    console.log('\n');
    console.log('💡 Tips:');
    console.log(
        '  - Upload the profile to https://www.speedscope.app/ for interactive analysis'
    );
    console.log('  - Look for unexpected functions taking significant time');
    console.log('  - Check for I/O operations that could be optimized');
    console.log('  - Consider caching expensive computations');
    console.log('');
} catch (err) {
    console.error('Error analyzing profile:', err.message);
    process.exit(1);
}
