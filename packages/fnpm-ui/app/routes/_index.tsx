import {
    Anchor,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Group,
    ScrollArea,
    Skeleton,
    Stack,
    Text,
} from '@mantine/core';
import type { MetaFunction, SerializeFrom } from '@remix-run/node';
import { Await, Link, defer, useLoaderData } from '@remix-run/react';
import {
    IconAlertCircle,
    IconBiohazard,
    IconCircleDashedCheck,
    IconJumpRope,
    IconPackageExport,
    IconPackages,
    IconUpload,
    IconZoomExclamation,
    type TablerIcon,
} from '@tabler/icons-react';
import { compartUpdate, concatNpmUrl, getDeps } from 'fnpm-toolkit';
import { type FC, type ReactNode, Suspense } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { PackageJson } from 'type-fest';
import { DependencyFlow } from '~/components/dependency-flow';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { AllClear } from '~/components/result';
import { SemverRange } from '~/components/semver-range';
import { root } from '~/server/config.server';
import { resolveContext, scan, update } from '~/server/fnpm.server';

export const meta: MetaFunction = () => {
    return [{ title: 'Dashboard' }];
};

interface InfoCardProps {
    icon: TablerIcon;
    title: string;
    value: ReactNode;
    href: string;
    graph: ReactNode;
}

const InfoCard: FC<InfoCardProps> = (props) => {
    const { icon: Icon, title, value, href, graph } = props;
    return (
        <Card padding='lg' radius='md' withBorder>
            <Group mb='xs' gap={8} style={{ userSelect: 'none' }}>
                <Icon size={24} />
                <Text fw={500} size={'lg'}>
                    {title}
                </Text>
                <Text size={'lg'} ml={'auto'} c={'gray'}>
                    {value}
                </Text>
            </Group>

            <Box w={'100%'} h={'300px'}>
                {graph}
            </Box>

            <Link to={href} style={{ all: 'unset' }}>
                <Button color='blue' fullWidth mt='md' radius='md'>
                    See more
                </Button>
            </Link>
        </Card>
    );
};

export async function loader() {
    const context = await resolveContext(root);
    const depsGraph = context.projects.map((project) => {
        const count = getDeps(project.manifest as PackageJson);
        return {
            name: project.manifest.name!,
            count: count.length,
        };
    });
    const { diagnoses } = await scan(root);
    const updates = update(context)
        .then((updates) => {
            return Object.entries(updates ?? {}).flatMap(
                ([workspace, json]) => {
                    return json.map((update) => {
                        return {
                            workspace: [workspace],
                            ...update,
                        };
                    });
                },
            );
        })
        .then((updates) => {
            const deduped = updates.reduce(
                (acc, curr) => {
                    const existing = acc.find(
                        (update) => update.name === curr.name,
                    );
                    if (existing) {
                        existing.workspace.push(...curr.workspace);
                    } else {
                        acc.push(curr);
                    }
                    return acc;
                },
                [] as typeof updates,
            );
            return deduped;
        });
    return defer({
        projects: context.projects,
        depsGraph,
        diagnoses,
        updates,
        rootProject: context.rootProject,
    });
}

type LoaderData = Awaited<ReturnType<typeof loader>>['data'];

const RADIAN = Math.PI / 180;
const getFormattedLabel = (e: any) => {
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        payload: { payload },
    } = e;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill='#8884d8'
            textAnchor={x > cx ? 'start' : 'end'}
            fontWeight={600}
            dominantBaseline='central'
            fontSize={14}
        >
            {payload.name}
        </text>
    );
};

interface CardItemProps {
    icon: TablerIcon;
    title: ReactNode;
    description: ReactNode;
}

const CardItem: FC<CardItemProps> = (props) => {
    const { icon: Icon, title, description } = props;
    return (
        <Box>
            <Flex gap={8} pt={10} justify={'start'}>
                <Box flex={1}>
                    <Icon color='black' style={{ opacity: '60%' }} />
                </Box>
                <Box w={'100%'}>{title}</Box>
            </Flex>
            <Box pb={10}>{description}</Box>
            <Divider />
        </Box>
    );
};

interface TotalWorkspaceProps {
    projects: SerializeFrom<LoaderData['projects']>;
    rootProject?: SerializeFrom<LoaderData['rootProject']>;
}

const TotalWorkspace: FC<TotalWorkspaceProps> = (props) => {
    const { projects, rootProject } = props;
    return (
        <InfoCard
            icon={IconJumpRope}
            title='Total Workspaces'
            value={projects.length}
            href='/graph'
            graph={
                <Anchor component={Link} to={'/packages'} w={'100%'} h={'100%'}>
                    <DependencyFlow
                        projects={projects}
                        rootProject={rootProject}
                        style={{ pointerEvents: 'none' }}
                    />
                </Anchor>
            }
        />
    );
};

interface TotalDepsProps {
    depsGraph: SerializeFrom<LoaderData['depsGraph']>;
}

const TotalDeps: FC<TotalDepsProps> = (props) => {
    const { depsGraph } = props;
    return (
        <InfoCard
            icon={IconPackages}
            title='Total Dependencies'
            value={depsGraph.reduce((acc, curr) => acc + curr.count, 0)}
            href='/packages'
            graph={
                <Box w={'100%'} h={'100%'} component={Link} to={'/packages'}>
                    <ResponsiveContainer
                        width={'100%'}
                        height={'100%'}
                        style={{ pointerEvents: 'none' }}
                    >
                        <PieChart>
                            <Pie
                                data={depsGraph}
                                dataKey={'count'}
                                nameKey={'name'}
                                labelLine={false}
                                label={getFormattedLabel}
                                fill='#82ca9d'
                                isAnimationActive={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            }
        />
    );
};

interface DependencyUpdatesProps {
    updates: Promise<SerializeFrom<LoaderData['updates']>>;
}

const DependencyUpdates: FC<DependencyUpdatesProps> = (props) => {
    const { updates } = props;
    return (
        <Suspense
            fallback={
                <InfoCard
                    icon={IconUpload}
                    title='Dependency Updates'
                    value={0}
                    href='/updates'
                    graph={
                        <ScrollArea h={'300px'}>
                            <Skeleton height={'300px'} w={'100%'} />
                        </ScrollArea>
                    }
                />
            }
        >
            <Await resolve={updates}>
                {(updates) => (
                    <InfoCard
                        icon={IconUpload}
                        title='Dependency Updates'
                        value={updates.length}
                        href='/updates'
                        graph={
                            updates.length === 0 ? (
                                <AllClear />
                            ) : (
                                <ScrollArea h={'300px'}>
                                    {updates.map((update) => {
                                        return (
                                            <DependencyUpdateItem
                                                update={update}
                                                key={Math.random()}
                                            />
                                        );
                                    })}
                                </ScrollArea>
                            )
                        }
                    />
                )}
            </Await>
        </Suspense>
    );
};

interface DependencyUpdateItemProps {
    update: SerializeFrom<LoaderData['updates']>[number];
}

const DependencyUpdateItem: FC<DependencyUpdateItemProps> = (props) => {
    const { update } = props;
    const type = compartUpdate(update.current, update.latest);
    return (
        <CardItem
            icon={IconPackageExport}
            title={
                <Flex align={'center'}>
                    <Anchor
                        href={concatNpmUrl(update.name)}
                        target='_blank'
                        underline='hover'
                        c={'dark'}
                    >
                        {update.name}
                    </Anchor>
                    <Badge
                        ml={'auto'}
                        color={
                            type === 'major'
                                ? 'red'
                                : type === 'minor'
                                  ? 'yellow'
                                  : 'blue'
                        }
                    >
                        {type}
                    </Badge>
                </Flex>
            }
            description={
                <Stack mt={4} gap={8}>
                    <SemverRange
                        name={update.name}
                        current={update.current}
                        to={update.latest}
                    />
                    <Text size='sm' c={'dark'}>
                        {update.workspace.join(', ')}
                    </Text>
                </Stack>
            }
        />
    );
};

interface DiagnosticIssuesProps {
    diagnoses: SerializeFrom<LoaderData['diagnoses']>;
}

const DiagnosticIssues: FC<DiagnosticIssuesProps> = (props) => {
    const { diagnoses } = props;
    const withoutInfo = diagnoses.filter((d) => d.level !== 'info');
    const infos = diagnoses.filter((d) => d.level === 'info');
    return (
        <InfoCard
            icon={IconZoomExclamation}
            title='Diagnostic Issues'
            value={withoutInfo.length}
            graph={
                withoutInfo.length === 0 ? (
                    <AllClear>
                        {infos.length > 0
                            ? `Only ${infos.length} non-serious issues found`
                            : 'No issues found'}
                    </AllClear>
                ) : (
                    <ScrollArea h={'300px'}>
                        {withoutInfo.map((diagnose) => (
                            <CardItem
                                key={diagnose.description}
                                icon={
                                    diagnose.level === 'error'
                                        ? IconBiohazard
                                        : diagnose.level === 'warning'
                                          ? IconAlertCircle
                                          : IconCircleDashedCheck
                                }
                                title={diagnose.title}
                                description={
                                    <>
                                        <Text
                                            size='sm'
                                            c={'dark'}
                                            fw={500}
                                            span
                                        >
                                            [{diagnose.scope}]{' '}
                                        </Text>
                                        <Text size='sm' c={'dark'} span>
                                            {diagnose.workspace?.join(', ') ??
                                                'root'}
                                        </Text>
                                    </>
                                }
                            />
                        ))}
                    </ScrollArea>
                )
            }
            href='/diagnose'
        />
    );
};

export default function Index() {
    const { depsGraph, projects, diagnoses, updates, rootProject } =
        useLoaderData<typeof loader>();
    return (
        <BasePage>
            <PageHeader title='Dashboard' />
            <Grid>
                <Grid.Col span={3}>
                    <TotalWorkspace
                        projects={projects}
                        rootProject={rootProject}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <TotalDeps depsGraph={depsGraph} />
                </Grid.Col>
                <Grid.Col span={3}>
                    <DependencyUpdates updates={updates} />
                </Grid.Col>
                <Grid.Col span={3}>
                    <DiagnosticIssues diagnoses={diagnoses} />
                </Grid.Col>
            </Grid>
        </BasePage>
    );
}
