import {
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Group,
    ScrollArea,
    Skeleton,
    Text,
} from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { Await, Link, defer, useLoaderData } from '@remix-run/react';
import {
    IconBiohazard,
    IconFileInfo,
    IconJumpRope,
    IconPackageExport,
    IconPackages,
    IconShieldQuestion,
    IconUpload,
    IconZoomExclamation,
    type TablerIcon,
} from '@tabler/icons-react';
import { getDeps } from 'fnpm-toolkit';
import { type FC, type ReactNode, Suspense } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { PackageJson } from 'type-fest';
import { DependencyFlow } from '~/components/dependency-flow';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { AllClear } from '~/components/result';
import { root } from '~/server/config.server';
import { resolveContext, scan, update } from '../server/fnpm.server';

export const meta: MetaFunction = () => {
    return [{ title: 'fnpm UI' }];
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
            <Group mb='xs' gap={8}>
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
    const depsGraph = context.projects.reduce(
        (acc, project) => {
            const count = getDeps(project.manifest as PackageJson);
            acc.push({
                name: project.manifest.name!,
                count: count.length,
            });
            return acc;
        },
        [] as Array<{
            name: string;
            count: number;
        }>,
    );
    const { diagnoses } = await scan(root);
    const updates = update(context).then((updates) => {
        return Object.entries(updates ?? {}).flatMap(([workspace, json]) => {
            return json.map((update) => {
                return {
                    workspace,
                    ...update,
                };
            });
        });
    });
    return defer({
        projects: context.projects,
        depsGraph,
        diagnoses,
        updates,
        rootProject: context.rootProject,
        isMonoRepo: context.isMonoRepo,
    });
}

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
            <Flex gap={8} pt={10}>
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

export default function Index() {
    const { depsGraph, projects, diagnoses, updates, rootProject, isMonoRepo } =
        useLoaderData<typeof loader>();
    return (
        <BasePage>
            <PageHeader title='Dashboard' />
            <Grid>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={IconJumpRope}
                        title='Total Workspaces'
                        value={projects.length}
                        href='/graph'
                        graph={
                            <DependencyFlow
                                projects={projects}
                                rootProject={rootProject}
                                isMonoRepo={isMonoRepo}
                            />
                        }
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={IconPackages}
                        title='Total Dependencies'
                        value={depsGraph.reduce(
                            (acc, curr) => acc + curr.count,
                            0,
                        )}
                        href='/packages'
                        graph={
                            <ResponsiveContainer width={'100%'} height={'100%'}>
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
                        }
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Suspense
                        fallback={
                            <InfoCard
                                icon={IconUpload}
                                title='Dependency Updates'
                                value={0}
                                href='/packages'
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
                                    href='/packages'
                                    graph={
                                        updates.length === 0 ? (
                                            <AllClear />
                                        ) : (
                                            <ScrollArea h={'300px'}>
                                                {updates.map((update) => (
                                                    <CardItem
                                                        icon={IconPackageExport}
                                                        key={Math.random()}
                                                        title={
                                                            <Flex
                                                                align={'center'}
                                                            >
                                                                <Text>
                                                                    {
                                                                        update.name
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    size='sm'
                                                                    ml={'auto'}
                                                                    c={'dark'}
                                                                >
                                                                    {
                                                                        update.current
                                                                    }{' '}
                                                                    {' > '}
                                                                    {
                                                                        update.latest
                                                                    }
                                                                </Text>
                                                            </Flex>
                                                        }
                                                        description={
                                                            <Box>
                                                                <Text
                                                                    size='sm'
                                                                    c={'dark'}
                                                                    span
                                                                >
                                                                    {
                                                                        update.workspace
                                                                    }
                                                                </Text>
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </ScrollArea>
                                        )
                                    }
                                />
                            )}
                        </Await>
                    </Suspense>
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={IconShieldQuestion}
                        title='Diagnostic Issues'
                        value={diagnoses.length}
                        graph={
                            diagnoses.length === 0 ? (
                                <AllClear />
                            ) : (
                                <ScrollArea h={'300px'}>
                                    {diagnoses.map((diagnose) => (
                                        <CardItem
                                            key={diagnose.description}
                                            icon={
                                                diagnose.level === 'error'
                                                    ? IconBiohazard
                                                    : diagnose.level ===
                                                        'warning'
                                                      ? IconZoomExclamation
                                                      : IconFileInfo
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
                                                    <Text
                                                        size='sm'
                                                        c={'dark'}
                                                        span
                                                    >
                                                        {diagnose.workspace?.join(
                                                            ', ',
                                                        ) ?? 'root'}
                                                    </Text>
                                                </>
                                            }
                                        />
                                    ))}
                                </ScrollArea>
                            )
                        }
                        href='/packages'
                    />
                </Grid.Col>
            </Grid>
        </BasePage>
    );
}
