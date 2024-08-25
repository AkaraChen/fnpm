import { Box, Button, Card, Grid, Group, Text } from '@mantine/core';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import {
    type LucideIcon,
    PackageIcon,
    ShieldQuestionIcon,
    UploadIcon,
    WorkflowIcon,
} from 'lucide-react';
import type { FC, ReactNode } from 'react';
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
    return await resolveContext(process.cwd());
}

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
                        value={10}
                        href='/graph'
                        graph={<DependencyFlow projects={data.projects} />}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <InfoCard
                        icon={PackageIcon}
                        title='Total Dependencies'
                        value={10}
                        href='/packages'
                        graph={<DependencyFlow projects={[]} />}
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
