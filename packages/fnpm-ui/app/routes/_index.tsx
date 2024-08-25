import { Box, Button, Card, Grid, Group, Text } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getDeps } from 'fnpm-utils';
import {
    type LucideIcon,
    PackageIcon,
    ShieldQuestionIcon,
    UploadIcon,
    WorkflowIcon,
} from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { PackageJson } from 'type-fest';
import { DependencyFlow } from '~/components/dependency-flow';
import { PageHeader } from '~/components/page-header';
import { resolveContext } from '../fnpm/fnpm.server';

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
    const { projects } = await resolveContext(process.cwd());
    const depsGraph = projects.reduce(
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
    return {
        projects,
        depsGraph,
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
                        value={10}
                        href='/packages'
                        graph={<DependencyFlow projects={[]} />}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={ShieldQuestionIcon}
                        title='Diagnostic Issues'
                        value={10}
                        graph={<DependencyFlow projects={[]} />}
                        href='/packages'
                    />
                </Grid.Col>
            </Grid>
        </>
    );
}
