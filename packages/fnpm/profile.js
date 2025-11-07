#!/usr/bin/env node

/**
 * Performance profiling script for fnpm CLI
 *
 * This script uses Node.js built-in profiler to analyze fnpm command performance.
 *
 * Usage:
 *   node profile.js <command> [args...]
 *
 * Examples:
 *   node profile.js --help
 *   node profile.js add lodash --dry-run
 *   node profile.js init
 *
 * The script will generate a CPU profile (.cpuprofile file) that can be:
 * 1. Opened in Chrome DevTools (chrome://inspect)
 * 2. Analyzed with speedscope (https://www.speedscope.app/)
 * 3. Processed with flamegraph tools
 */

import { Session } from 'node:inspector';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command args (everything after profile.js)
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node profile.js <command> [args...]');
    console.error('Example: node profile.js --help');
    process.exit(1);
}

// Setup profiler
const session = new Session();
session.connect();

const profilePath = join(__dirname, `profile-${Date.now()}.cpuprofile`);

console.log('Starting CPU profiling...');
console.log('Command:', args.join(' '));
console.log('Profile will be saved to:', profilePath);
console.log('');

// Start profiling
session.post('Profiler.enable');
session.post('Profiler.start');

const startTime = performance.now();
let commandFinished = false;
let originalExit = process.exit;

// Override process.exit to capture the command completion
process.exit = function (code) {
    if (commandFinished) {
        originalExit.call(process, code);
        return;
    }

    commandFinished = true;
    const endTime = performance.now();

    // Stop profiling
    session.post('Profiler.stop', (err, { profile }) => {
        if (err) {
            console.error('Profiling error:', err);
            originalExit.call(process, 1);
            return;
        }

        // Save profile
        writeFileSync(profilePath, JSON.stringify(profile));

        console.log('');
        console.log('─'.repeat(60));
        console.log('Profiling complete!');
        console.log(
            'Total execution time:',
            (endTime - startTime).toFixed(2),
            'ms'
        );
        console.log('Profile saved to:', profilePath);
        console.log('');
        console.log('To analyze the profile:');
        console.log('1. Open Chrome DevTools (chrome://inspect)');
        console.log('2. Click "Open dedicated DevTools for Node"');
        console.log('3. Go to "Profiler" tab');
        console.log('4. Click "Load" and select the .cpuprofile file');
        console.log('');
        console.log('Or upload to: https://www.speedscope.app/');
        console.log('─'.repeat(60));

        session.disconnect();
        originalExit.call(process, code || 0);
    });
};

// Run the fnpm command by importing it
// We need to set process.argv to match what fnpm expects
process.argv = ['node', join(__dirname, 'dist/fnpm.js'), ...args];

// Import and run fnpm
import(join(__dirname, 'dist/fnpm.js')).catch((err) => {
    console.error('Error running fnpm:', err);
    session.disconnect();
    originalExit.call(process, 1);
});
