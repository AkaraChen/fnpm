import {
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Group,
    ScrollArea,
    Text,
} from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getDeps } from 'fnpm-utils';
import {
    BiohazardIcon,
    CandyIcon,
    type LucideIcon,
    PackageIcon,
    ShieldQuestionIcon,
    TriangleAlertIcon,
    UploadIcon,
    WorkflowIcon,
} from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { PackageJson } from 'type-fest';
import { DependencyFlow } from '~/components/dependency-flow';
import { PageHeader } from '~/components/page-header';
import { resolveContext, scan, update } from '../fnpm/fnpm.server';

export const meta: MetaFunction = () => {
    return [{ title: 'fnpm UI' }];
};

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    value: ReactNode;
    href: string;
    graph: ReactNode;
}

const InfoCard: FC<InfoCardProps> = (props) => {
    const { icon: Icon, title, value, href, graph } = props;
    return (
        <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Group mb='xs'>
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
    const context = await resolveContext(process.cwd());
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
    const { diagnoses } = await scan(process.cwd());
    const updates = await update(context);
    return {
        projects: context.projects,
        depsGraph,
        diagnoses,
        updates,
    };
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

interface ItemProps {
    icon: LucideIcon;
    title: ReactNode;
    description: ReactNode;
}

const Item: FC<ItemProps> = (props) => {
    const { icon: Icon, title, description } = props;
    return (
        <Box>
            <Flex gap={8} pt={10}>
                <Box flex={1}>
                    <Icon color='gray' />
                </Box>
                <Text w={'100%'}>{title}</Text>
            </Flex>
            <Box pb={10}>{description}</Box>
            <Divider />
        </Box>
    );
};

export default function Index() {
    const data = useLoaderData<typeof loader>();
    return (
        <>
            <PageHeader title='Dashboard' />
            <Grid>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={WorkflowIcon}
                        title='Total Workspaces'
                        value={data.projects.length}
                        href='/graph'
                        graph={<DependencyFlow projects={data.projects} />}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={PackageIcon}
                        title='Total Dependencies'
                        value={data.depsGraph.reduce(
                            (acc, curr) => acc + curr.count,
                            0,
                        )}
                        href='/packages'
                        graph={
                            <ResponsiveContainer width={'100%'} height={'100%'}>
                                <PieChart>
                                    <Pie
                                        data={data.depsGraph}
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
                    <InfoCard
                        icon={UploadIcon}
                        title='Dependency Updates'
                        value={Object.values(data.updates || {}).reduce(
                            (acc, curr) => acc + curr.length,
                            0,
                        )}
                        href='/packages'
                        graph={
                            <ScrollArea h={'300px'}>
                                {Object.entries(data.updates ?? {}).map(
                                    ([workspace, json]) => {
                                        return json.map((update) => {
                                            return (
                                                <Item
                                                    icon={CandyIcon}
                                                    key={update.name}
                                                    title={
                                                        <Flex align={'center'}>
                                                            <Text>
                                                                {update.name}
                                                            </Text>
                                                            <Text
                                                                size='sm'
                                                                ml={'auto'}
                                                            >
                                                                {update.current}{' '}
                                                                {' > '}
                                                                {update.latest}
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
                                                                {workspace}
                                                            </Text>
                                                        </Box>
                                                    }
                                                />
                                            );
                                        });
                                    },
                                )}
                            </ScrollArea>
                        }
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={ShieldQuestionIcon}
                        title='Diagnostic Issues'
                        value={data.diagnoses.length}
                        graph={
                            <ScrollArea h={'300px'}>
                                {data.diagnoses.map((diagnose) => (
                                    <Item
                                        key={diagnose.description}
                                        icon={
                                            diagnose.level === 'error'
                                                ? BiohazardIcon
                                                : diagnose.level === 'warning'
                                                  ? TriangleAlertIcon
                                                  : diagnose.level === 'info'
                                                    ? ShieldQuestionIcon
                                                    : ShieldQuestionIcon
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
                                                    {diagnose.workspace?.join(
                                                        ', ',
                                                    ) ?? 'root'}
                                                </Text>
                                            </>
                                        }
                                    />
                                ))}
                            </ScrollArea>
                        }
                        href='/packages'
                    />
                </Grid.Col>
            </Grid>
        </>
    );
}
