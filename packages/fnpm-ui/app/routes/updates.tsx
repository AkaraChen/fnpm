import {
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    ScrollArea,
    SimpleGrid,
    Text,
    rem,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import type { Project } from '@pnpm/types';
import type { SerializeFrom } from '@remix-run/node';
import { Await, defer, useLoaderData } from '@remix-run/react';
import { IconUpload } from '@tabler/icons-react';
import { commands } from 'pm-combo';
import { group, shake } from 'radash';
import {
    type Dispatch,
    type FC,
    type SetStateAction,
    Suspense,
    createContext,
    useContext,
    useState,
} from 'react';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { type RunElement, useRun } from '~/hooks/run';
import { root } from '~/server/config.server';
import {
    type UpdateManifest,
    resolveContext,
    update,
} from '~/server/fnpm.server';

interface UpdateManifestWithWorkspace extends UpdateManifest {
    workspace: string;
}

export async function loader() {
    const ctx = await resolveContext(root);
    const updates = update(ctx).then((updates) => {
        return Object.fromEntries(
            Object.entries(updates).map(([workspace, updates]) => [
                workspace,
                updates.map((update) => ({ ...update, workspace })),
            ]),
        );
    });
    const { projects, pm } = ctx;
    return defer({
        updates,
        projects,
        pm,
    });
}

type PageContext = {
    selected: UpdateManifestWithWorkspace[];
    setSelected: Dispatch<SetStateAction<UpdateManifestWithWorkspace[]>>;
    updates: Record<string, UpdateManifestWithWorkspace[]>;
    check: (...manifest: UpdateManifestWithWorkspace[]) => void;
    unCheck: (...manifest: UpdateManifestWithWorkspace[]) => void;
    projects: SerializeFrom<Project[]>;
    pm: Awaited<ReturnType<typeof loader>>['data']['pm'];
};

const PageContext = createContext<PageContext>({} as PageContext);

interface UpdateGroupProps {
    updates: UpdateManifestWithWorkspace[];
    label: string;
}

const UpdateGroup: FC<UpdateGroupProps> = (props) => {
    const { updates, label } = props;
    const { selected, check, unCheck } = useContext(PageContext);
    const isAllSelected = updates.every((upd) => {
        return selected.includes(upd);
    });
    return (
        <Card withBorder h={300}>
            <Flex align={'center'} gap={12}>
                <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                            check(...updates);
                        } else {
                            unCheck(...updates);
                        }
                    }}
                />
                <Text fw={500}>{label}</Text>
            </Flex>
            <ScrollArea mt={12}>
                {updates.map((update) => (
                    <Box key={update.name}>
                        <Flex py={12} align={'center'} gap={12}>
                            <Checkbox
                                checked={selected.includes(update)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        check(update);
                                    } else {
                                        unCheck(update);
                                    }
                                }}
                            />
                            <Text>{update.name}</Text>
                            <Box ml={'auto'}>
                                <Badge variant='light'>
                                    {update.current} {' > '}
                                    {update.latest}
                                </Badge>
                            </Box>
                        </Flex>
                        <Divider />
                    </Box>
                ))}
            </ScrollArea>
        </Card>
    );
};

const GroupByWorkspace: FC = () => {
    const { updates } = useContext(PageContext);
    const shaked: typeof updates = shake(updates, (v) => !v.length);
    return Object.entries(shaked).map(([workspace, updates]) => (
        <UpdateGroup key={workspace} updates={updates} label={workspace} />
    ));
};

const UpdateButton: FC = () => {
    const { selected, pm, projects } = useContext(PageContext);
    const run = useRun();
    const groupByWorkspace = group(selected, (upd) => upd.workspace);
    const start = () => {
        const queue: RunElement[] = Object.entries(groupByWorkspace).map(
            ([workspace, updates]) => {
                return {
                    cwd: projects.find((p) => p.manifest.name === workspace)!
                        .rootDir,
                    command: commands.update
                        .concat(pm, {
                            packages: updates!.map(
                                (upd) => `${upd.name}@${upd.latest}`,
                            ),
                        })
                        .join(' '),
                } as RunElement;
            },
        );
        run.start({
            queue,
        });
    };
    const openConfirm = () => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Text size='sm'>
                    This action will update the selected packages, and cannot be
                    undone. Make sure you have a backup or git commit before
                    proceeding.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => {
                start();
            },
        });
    };
    return (
        <>
            {run.holder}
            <Button
                size='md'
                leftSection={
                    <IconUpload style={{ width: rem(20), height: rem(20) }} />
                }
                w={128}
                onClick={() => {
                    openConfirm();
                }}
            >
                Update
            </Button>
        </>
    );
};

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const [selected, setSelected] = useState<UpdateManifestWithWorkspace[]>([]);
    const check = (...manifest: UpdateManifestWithWorkspace[]) => {
        setSelected((prev) => {
            return [
                ...prev.filter((upd) => !manifest.includes(upd)),
                ...manifest,
            ];
        });
    };
    const unCheck = (...manifests: UpdateManifest[]) => {
        setSelected((prev) => {
            return prev.filter(
                (upd) => !manifests.some((manifest) => manifest === upd),
            );
        });
    };

    return (
        <BasePage>
            <PageHeader title='Updates' />
            <Box h={'100%'} style={{ overflow: 'hidden' }}>
                <Suspense>
                    <Await resolve={data.updates}>
                        {(updates) => {
                            return (
                                <PageContext.Provider
                                    value={{
                                        selected,
                                        setSelected,
                                        updates,
                                        check,
                                        unCheck,
                                        projects: data.projects,
                                        pm: data.pm,
                                    }}
                                >
                                    <ScrollArea
                                        h={'100%'}
                                        style={{
                                            height: '100%',
                                        }}
                                        styles={{
                                            viewport: {
                                                height: '100%',
                                            },
                                        }}
                                    >
                                        <SimpleGrid cols={3}>
                                            <GroupByWorkspace />
                                        </SimpleGrid>
                                        <Box
                                            pos={'absolute'}
                                            right={24}
                                            bottom={24}
                                        >
                                            <UpdateButton />
                                        </Box>
                                    </ScrollArea>
                                </PageContext.Provider>
                            );
                        }}
                    </Await>
                </Suspense>
            </Box>
        </BasePage>
    );
}
