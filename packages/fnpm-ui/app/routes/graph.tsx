import { Box } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';
import { DependencyFlow } from '~/components/dependency-flow';
import { PageHeader } from '~/components/page-header';
import { resolveContext } from '~/fnpm/fnpm.server';

export async function loader() {
    const { projects } = await resolveContext(process.cwd());
    return {
        projects,
    };
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    return (
        <>
            <PageHeader title='Graph' />
            <Box w={'calc(100vw-300px)'} h={'100vh'}>
                <DependencyFlow projects={data.projects} />
            </Box>
        </>
    );
}
