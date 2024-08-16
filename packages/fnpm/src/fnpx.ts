#!/usr/bin/env node

import { commands } from "unpm";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import pkg from "../package.json";
import { error, exec, getContext, noop, normalizePackageVersion } from "./util";

const { pm } = await getContext(process.cwd());

await yargs(hideBin(process.argv))
    .scriptName("fnpx")
    .completion()
    .recommendCommands()
    .version(pkg.version)
    .alias("version", "v")
    .help()
    .alias("help", "h")
    .command("*", "download and exec", noop, async (argv) => {
        if (!argv._.length) {
            error("No command specified");
        }
        const args = argv._ as string[];
        const [command, ...rest] = args;
        if (!command) {
            error("No command specified");
        }
        const shell = commands.dlx
            .concat(pm, {
                package: normalizePackageVersion(command!),
                args: rest,
            })
            .join(" ");
        await exec(shell);
    })
    .help()
    .alias("help", "h")
    .usage("Usage: $0 <command> [options]")
    .parse();
