import {
    ActionIcon,
    Box,
    Card,
    Flex,
    Grid,
    Menu,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    rem,
} from '@mantine/core';
import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
    IconAdjustments,
    IconArrowsLeftRight,
    IconBrandNpm,
    IconPlayerPlay,
    IconTrash,
    type TablerIcon,
} from '@tabler/icons-react';
import { resolveContext } from 'fnpm-doctor';
import { getDep } from 'fnpm-toolkit';
import { commands } from 'pm-combo';
import { type FC, type ReactNode, createContext, useContext } from 'react';
import type { PackageJson } from 'type-fest';
import { useRun } from '~/components/run';
import { root } from '~/server/config.server';

export async function loader(args: LoaderFunctionArgs) {
    const context = await resolveContext(root);
    const pm = context.pm;
    const project = context.projects.find(
        (p) => p.manifest.name === args.params.name,
    )!;
    return {
        project,
        pm,
    };
}

type PageContext = SerializeFrom<Awaited<ReturnType<typeof loader>>>;

interface CardItemProps {
    label: string;
    content: ReactNode;
    extra?: ReactNode;
}

const CardItem: FC<CardItemProps> = ({ label, content, extra }) => {
    return (
        <Flex gap={4}>
            <Stack gap={4}>
                <Text size='sm' c='dimmed'>
                    {label}
                </Text>
                <Text>{content}</Text>
            </Stack>
            {extra && <Box ml={'auto'}>{extra}</Box>}
        </Flex>
    );
};

const PublishField: FC = () => {
    const { project } = useContext(PageContext);
    return (
        <SimpleGrid cols={2}>
            <CardItem label='Version' content={project.manifest.version!} />
            <CardItem
                label='Type'
                // @ts-ignore
                content={project.manifest.type || 'commonjs'}
            />
            <CardItem
                label='Has export'
                content={
                    project.manifest.exports
                        ? 'Yes'
                        : project.manifest.module
                          ? 'Yes'
                          : project.manifest.main
                            ? 'Yes'
                            : 'No'
                }
            />
            <CardItem
                label='Dependencies'
                content={
                    Object.keys(project.manifest.dependencies || {}).length
                }
            />
        </SimpleGrid>
    );
};

const ScriptItem: FC<{ name: string }> = ({ name }) => {
    const { project, pm } = useContext(PageContext);
    const run = useRun({
        command: commands.run
            .concat(pm, {
                script: name,
            })
            .join(' '),
        cwd: project.rootDir,
    });
    return (
        <>
            {run.holder}
            <ActionIcon
                variant='default'
                aria-label='Run'
                onClick={() => {
                    run.start();
                }}
            >
                <IconPlayerPlay
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                />
            </ActionIcon>
        </>
    );
};

const Scripts: FC = () => {
    const { project } = useContext(PageContext);
    return (
        <SimpleGrid cols={2}>
            {Object.entries(project.manifest.scripts || {}).map(
                ([key, value]) => (
                    <CardItem
                        key={key}
                        label={key}
                        content={value}
                        extra={<ScriptItem name={key} />}
                    />
                ),
            )}
        </SimpleGrid>
    );
};

interface DependencyGroupProps {
    deps: Record<string, string>;
    title: string;
}

interface DepsMenuProps {
    name: string;
}

interface DepsMenuItemIconProps {
    icon: TablerIcon;
}

const DepsMenuItemIcon: FC<DepsMenuItemIconProps> = (props) => {
    const { icon: Icon } = props;
    return (
        <Icon
            style={{
                width: rem(14),
                height: rem(14),
            }}
        />
    );
};

const DepsMenu: FC<DepsMenuProps> = (props) => {
    const { project, pm } = useContext(PageContext);
    const { name } = props;
    // const { field, version } = getDep(project.manifest as PackageJson, name)!;
    // console.log(field, version);
    const remove = useRun({
        cwd: project.rootDir,
        command: commands.remove
            .concat(pm, {
                packages: [name],
            })
            .join(' '),
        onSuccess() {
            window.location.reload();
        },
    });
    return (
        <>
            {remove.holder}
            <Menu shadow='md' width={200}>
                <Menu.Target>
                    <ActionIcon variant='default' aria-label='Settings'>
                        <IconAdjustments
                            style={{
                                width: '70%',
                                height: '70%',
                            }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown aria-modal>
                    <Menu.Label>Package</Menu.Label>
                    <Menu.Item
                        leftSection={<DepsMenuItemIcon icon={IconBrandNpm} />}
                        onClick={() => {
                            const url = new URL(name, 'https://npm.im');
                            window.open(url);
                        }}
                    >
                        npm
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        disabled
                        leftSection={
                            <DepsMenuItemIcon icon={IconArrowsLeftRight} />
                        }
                    >
                        Move
                    </Menu.Item>
                    <Menu.Item
                        color='red'
                        leftSection={<DepsMenuItemIcon icon={IconTrash} />}
                        onClick={() => {
                            remove.start();
                        }}
                    >
                        Uninstall
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

const DependencyGroup: FC<DependencyGroupProps> = (props) => {
    const { deps, title } = props;
    return (
        <Stack>
            <Text>{title}</Text>
            <SimpleGrid cols={2}>
                {Object.entries(deps).map(([key, value]) => (
                    <CardItem
                        label={key}
                        content={value}
                        key={key}
                        extra={<DepsMenu name={key} />}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

const Dependency: FC = () => {
    const { project } = useContext(PageContext);
    return (
        <Stack>
            {project.manifest.dependencies && (
                <DependencyGroup
                    deps={project.manifest.dependencies}
                    title='Dependencies'
                />
            )}
            {project.manifest.devDependencies && (
                <DependencyGroup
                    deps={project.manifest.devDependencies}
                    title='Dev dependencies'
                />
            )}
            {project.manifest.peerDependencies && (
                <DependencyGroup
                    deps={project.manifest.peerDependencies}
                    title='Peer dependencies'
                />
            )}
            {project.manifest.optionalDependencies && (
                <DependencyGroup
                    deps={project.manifest.optionalDependencies}
                    title='Optional dependencies'
                />
            )}
        </Stack>
    );
};

const PageContext = createContext<PageContext>(null as unknown as PageContext);

export default function Page() {
    const data = useLoaderData<typeof loader>();
    return (
        <PageContext.Provider value={data}>
            <Grid
                h={'100%'}
                w={'100%'}
                styles={{
                    inner: {
                        height: '100%',
                    },
                    col: {
                        height: '100%',
                    },
                }}
            >
                <Grid.Col span={6}>
                    <Stack h={'100%'}>
                        <Box flex={1} h={'50%'}>
                            <Card withBorder h={'100%'}>
                                <Text fw={500} mb={20}>
                                    Publish field
                                </Text>
                                <ScrollArea h={'100%'}>
                                    <PublishField />
                                </ScrollArea>
                            </Card>
                        </Box>
                        <Box flex={1} h={'50%'}>
                            <Card withBorder h={'100%'}>
                                <Text fw={500} mb={20}>
                                    Scripts
                                </Text>
                                <ScrollArea h={'100%'}>
                                    <Scripts />
                                </ScrollArea>
                            </Card>
                        </Box>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card withBorder h={'100%'}>
                        <Text fw={500} mb={20}>
                            Dependency
                        </Text>
                        <ScrollArea h={'100%'}>
                            <Dependency />
                        </ScrollArea>
                    </Card>
                </Grid.Col>
            </Grid>
        </PageContext.Provider>
    );
}
