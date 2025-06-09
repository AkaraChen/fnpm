import {
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
    useMantineTheme,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import type { Project } from '@pnpm/types';
import { IconCircleCheck, IconUpload } from '@tabler/icons-react';
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
import type { MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { ResultPage } from '~/components/result';
import { SemverRange } from '~/components/semver-range';
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
    return {
        updates,
        projects,
        pm,
    };
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Updates',
            description: 'Update packages',
        },
    ];
};

type PageContext = {
    selected: UpdateManifestWithWorkspace[];
    setSelected: Dispatch<SetStateAction<UpdateManifestWithWorkspace[]>>;
    updates: Record<string, UpdateManifestWithWorkspace[]>;
    check: (...manifest: UpdateManifestWithWorkspace[]) => void;
    unCheck: (...manifest: UpdateManifestWithWorkspace[]) => void;
    projects: Project[];
    pm: Awaited<ReturnType<typeof loader>>['pm'];
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
                                <SemverRange
                                    name={update.name}
                                    current={update.current}
                                    to={update.latest}
                                />
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
    const run = useRun({
        onSuccess() {
            window.location.reload();
        },
    });
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
    const theme = useMantineTheme();

    return (
        <BasePage>
            <PageHeader title='Updates' />
            <Box h={'100%'} style={{ overflow: 'hidden' }}>
                <Suspense>
                    <Await resolve={data.updates}>
                        {(updates) => {
                            const hasUpdate = Object.values(updates).some(
                                (v) => v.length,
                            );
                            return (
                                <PageContext.Provider
                                    value={{
                                        selected,
                                        setSelected,
                                        updates,
                                        check,
                                        unCheck,
                                        projects:
                                            data.projects as unknown as Project[],
                                        pm: data.pm,
                                    }}
                                >
                                    {hasUpdate ? (
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
                                    ) : (
                                        <ResultPage
                                            icon={IconCircleCheck}
                                            title='Fresh out of updates'
                                            iconColor={
                                                hasUpdate
                                                    ? theme.colors.blue[6]
                                                    : theme.colors.green[6]
                                            }
                                        >
                                            There are no updates available for
                                            your packages.
                                        </ResultPage>
                                    )}
                                </PageContext.Provider>
                            );
                        }}
                    </Await>
                </Suspense>
            </Box>
        </BasePage>
    );
}
