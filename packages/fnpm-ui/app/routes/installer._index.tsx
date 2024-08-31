import { Button, Checkbox, Flex, Stack, TextInput } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import { commands } from 'pm-combo';
import { Suspense, useDeferredValue, useState } from 'react';
import { NpmSearch } from '~/components/npm-search';
import { useRun } from '~/components/run';
import { root } from '~/server/config.server';
import { resolveContext } from '~/server/fnpm.server';

export async function loader() {
    const context = resolveContext(root);
    return context;
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const deffered = useDeferredValue(search);
    const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
    const run = useRun({
        onSuccess() {
            setSelectedPackages([]);
            setSelectedProjects([]);
        },
    });
    return (
        <Stack h={'100%'}>
            {run.holder}
            <Flex mb={10} w={'100%'} gap={8}>
                <TextInput
                    placeholder='Search packages'
                    w={400}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    onClick={() => {
                        run.start({
                            queue: selectedProjects.map((name) => ({
                                command: commands.add
                                    .concat(data.pm, {
                                        packages: selectedPackages,
                                        allowRoot:
                                            data.isMonoRepo &&
                                            name ===
                                                data.rootProject!.manifest.name,
                                    })
                                    .join(' '),
                                cwd: data.projects.find(
                                    (project) => project.manifest.name === name,
                                )?.rootDir,
                            })),
                        });
                    }}
                >
                    Install
                </Button>
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
