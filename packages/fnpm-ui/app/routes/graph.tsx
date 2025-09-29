import { Box } from '@mantine/core';
import type { MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { DependencyFlow } from '~/components/dependency-flow';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { root } from '~/server/config.server';
import { resolveWorkspaceContext } from '~/server/fnpm.server';

export async function loader() {
    const { projects, rootProject } = await resolveWorkspaceContext(root);
    return {
        projects,
        rootProject,
    };
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Graph',
            description: 'Graph of dependencies',
        },
    ];
};

export default function Page() {
    const data = useLoaderData<typeof loader>();
    return (
        <BasePage>
            <PageHeader title='Graph' />
            <Box w={'calc(100vw-300px)'} h={'100%'}>
                <DependencyFlow
                    projects={data.projects.map((p) => p.manifest)}
                    rootProject={data.rootProject?.manifest}
                />
            </Box>
        </BasePage>
    );
}
