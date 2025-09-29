import {
    Box,
    Button,
    Checkbox,
    Flex,
    rem,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { commands } from 'pm-combo';
import { Suspense, useDeferredValue, useState } from 'react';
import { useLoaderData } from 'react-router';
import { InstallConfirm } from '~/components/install-confirm';
import { NpmSearch } from '~/components/npm-search';
import { useQueryParams } from '~/hooks/qps';
import { type RunElement, useRun } from '~/hooks/run';
import { root } from '~/server/config.server';
import { resolveWorkspaceContext } from '~/server/fnpm.server';

export async function loader() {
    return await resolveWorkspaceContext(root);
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
                        const { dev, prod, peer, optional } = options;

                        const queue = selectedProjects.flatMap((name) => {
                            const isRoot =
                                data.kind === 'mono' &&
                                data.rootProject?.manifest.name === name;
                            const shells = [
                                prod.length &&
                                    commands.add.concat(data.pm, {
                                        packages: prod.map((pkg) => pkg.name),
                                        allowRoot: isRoot,
                                    }),
                                dev.length &&
                                    commands.add.concat(data.pm, {
                                        packages: dev.map((pkg) => pkg.name),
                                        saveDev: true,
                                        allowRoot: isRoot,
                                    }),
                                peer.length &&
                                    commands.add.concat(data.pm, {
                                        packages: peer.map((pkg) => pkg.name),
                                        savePeer: true,
                                        allowRoot: isRoot,
                                    }),
                                optional.length &&
                                    commands.add.concat(data.pm, {
                                        packages: optional.map(
                                            (pkg) => pkg.name
                                        ),
                                        saveOptional: true,
                                        allowRoot: isRoot,
                                    }),
                            ]
                                .filter((v) => !(v === 0))
                                .map((c) => c!.join(' '));
                            return shells.map<RunElement>((shell) => {
                                return {
                                    command: shell,
                                    cwd: data.projects.find(
                                        (project) =>
                                            project.manifest.name === name
                                    )?.rootDir,
                                };
                            });
                        });
                        run.start({ queue });
                    }}
                    opened={open}
                    onOpenChange={setOpen}
                />
            </Flex>
            <Flex mb={10} gap={20} wrap={'wrap'}>
                {data.projects.map((project) => {
                    const isSelected = selectedProjects.includes(
                        project.manifest.name!
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
                                                name !== project.manifest.name
                                        )
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
                                selectedPackages.filter((pkg) => pkg !== name)
                            );
                        }
                    }}
                />
            </Suspense>
            <Box pos={'absolute'} right={40} bottom={40}>
                <Button
                    onClick={() => setOpen(true)}
                    size='md'
                    w={128}
                    leftSection={
                        <IconDownload
                            style={{ width: rem(20), height: rem(20) }}
                        />
                    }
                >
                    Install
                </Button>
            </Box>
        </Stack>
    );
}
