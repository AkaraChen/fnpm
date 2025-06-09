import { Button, Flex, Stack, TextInput, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { commands } from 'pm-combo';
import { Suspense, useDeferredValue, useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { InstallConfirm } from '~/components/install-confirm';
import { NpmSearch } from '~/components/npm-search';
import { useQueryParams } from '~/hooks/qps';
import { type RunElement, useRun } from '~/hooks/run';
import { root } from '~/server/config.server';
import { resolveContext } from '~/server/fnpm.server';

export async function loader(args: LoaderFunctionArgs) {
    const name = args.params.name;
    const context = await resolveContext(root);
    const pm = context.pm;
    const project = context.projects.find(
        (project) => project.manifest.name === name,
    );
    const isRoot =
        context.isMonoRepo && context.rootProject?.manifest.name === name;
    return { pm, project, isRoot };
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const [search, setSearch] = useQueryParams('search');
    const deffered = useDeferredValue(search);
    const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
    const run = useRun({
        onSuccess() {
            setSelectedPackages([]);
        },
    });
    const [open, setOpen] = useState(false);
    return (
        <Stack h={'100%'}>
            <Flex mb={10} gap={8}>
                <TextInput
                    placeholder='Search packages'
                    w={400}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftSection={
                        <IconSearch
                            style={{
                                width: rem(16),
                                height: rem(16),
                            }}
                        />
                    }
                />
                <InstallConfirm
                    key={selectedPackages.join(',')}
                    packages={selectedPackages}
                    onConfirm={(options) => {
                        const { dev, prod, peer, optional } = options;
                        const shells = [
                            prod.length &&
                                commands.add.concat(data.pm, {
                                    packages: prod.map((pkg) => pkg.name),
                                    allowRoot: data.isRoot,
                                }),
                            dev.length &&
                                commands.add.concat(data.pm, {
                                    packages: dev.map((pkg) => pkg.name),
                                    saveDev: true,
                                    allowRoot: data.isRoot,
                                }),
                            peer.length &&
                                commands.add.concat(data.pm, {
                                    packages: peer.map((pkg) => pkg.name),
                                    savePeer: true,
                                    allowRoot: data.isRoot,
                                }),
                            optional.length &&
                                commands.add.concat(data.pm, {
                                    packages: optional.map((pkg) => pkg.name),
                                    saveOptional: true,
                                    allowRoot: data.isRoot,
                                }),
                        ]
                            .filter((v) => !(v === 0))
                            .map((c) => c!.join(' '));
                        const queue = shells.map<RunElement>((shell) => {
                            return {
                                command: shell,
                                cwd: data.project!.rootDir,
                            };
                        });
                        run.start({ queue });
                    }}
                    opened={open}
                    onOpenChange={setOpen}
                />
                <Button onClick={() => setOpen(true)}>Install</Button>
            </Flex>
            <Suspense>
                <NpmSearch
                    search={deffered}
                    toggles={selectedPackages}
                    onToggle={(name, checked) => {
                        if (checked) {
                            setSelectedPackages([...selectedPackages, name]);
                        } else {
                            setSelectedPackages(
                                selectedPackages.filter((pkg) => pkg !== name),
                            );
                        }
                    }}
                />
            </Suspense>
        </Stack>
    );
}
