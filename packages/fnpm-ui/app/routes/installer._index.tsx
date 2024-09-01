import { Button, Checkbox, Flex, Stack, TextInput, rem } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import { IconSearch } from '@tabler/icons-react';
import { commands } from 'pm-combo';
import { Suspense, useDeferredValue, useState } from 'react';
import { InstallConfirm } from '~/components/install-confirm';
import { NpmSearch } from '~/components/npm-search';
import { useQueryParams } from '~/hooks/qps';
import { type RunElement, useRun } from '~/hooks/run';
import { root } from '~/server/config.server';
import { resolveContext } from '~/server/fnpm.server';

export async function loader() {
    const context = resolveContext(root);
    return context;
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [search, setSearch] = useQueryParams('search');
    const deffered = useDeferredValue(search);
    const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
    const run = useRun({
        onSuccess() {
            setSelectedPackages([]);
            setSelectedProjects([]);
        },
    });
    const [open, setOpen] = useState(false);
    return (
        <Stack h={'100%'}>
            {run.holder}
            <Flex mb={10} w={'100%'} gap={8}>
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
                        const prods = options.packages.filter(
                            (pkg) => pkg.field === 'prod',
                        );
                        const dev = options.packages.filter(
                            (pkg) => pkg.field === 'dev',
                        );
                        const peer = options.packages.filter(
                            (pkg) => pkg.field === 'peer',
                        );
                        const optional = options.packages.filter(
                            (pkg) => pkg.field === 'optional',
                        );

                        const queue = selectedProjects.flatMap((name) => {
                            const shells = [
                                commands.add.concat(data.pm, {
                                    packages: prods.map((pkg) => pkg.name),
                                    allowRoot:
                                        data.rootProject?.manifest.name ===
                                        name,
                                }),
                                commands.add.concat(data.pm, {
                                    packages: dev.map((pkg) => pkg.name),
                                    saveDev: true,
                                    allowRoot:
                                        data.rootProject?.manifest.name ===
                                        name,
                                }),
                                commands.add.concat(data.pm, {
                                    packages: peer.map((pkg) => pkg.name),
                                    savePeer: true,
                                    allowRoot:
                                        data.rootProject?.manifest.name ===
                                        name,
                                }),
                                commands.add.concat(data.pm, {
                                    packages: optional.map((pkg) => pkg.name),
                                    saveOptional: true,
                                    allowRoot:
                                        data.rootProject?.manifest.name ===
                                        name,
                                }),
                            ].map((c) => c.join(' '));
                            return shells.map<RunElement>((shell) => {
                                return {
                                    command: shell,
                                    cwd: data.projects.find(
                                        (project) =>
                                            project.manifest.name === name,
                                    )?.rootDir,
                                };
                            });
                        });
                        run.start({ queue });
                    }}
                    opened={open}
                    onOpenChange={setOpen}
                />
                <Button onClick={() => setOpen(true)}>Install</Button>
            </Flex>
            <Flex mb={10} gap={20}>
                {data.projects.map((project) => {
                    const isSelected = selectedProjects.includes(
                        project.manifest.name!,
                    );
                    return (
                        <Checkbox
                            key={project.manifest.name}
                            checked={isSelected}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedProjects([
                                        ...selectedProjects,
                                        project.manifest.name!,
                                    ]);
                                } else {
                                    setSelectedProjects(
                                        selectedProjects.filter(
                                            (name) =>
                                                name !== project.manifest.name,
                                        ),
                                    );
                                }
                            }}
                            label={project.manifest.name}
                        />
                    );
                })}
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
