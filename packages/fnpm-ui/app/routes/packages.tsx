import { Box, NativeSelect, Skeleton } from '@mantine/core';
import { Await, Outlet, defer, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { resolveContext } from '../server/fnpm.server';

export async function loader() {
    const context = resolveContext(process.cwd());
    return defer({
        context,
    });
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    return (
        <BasePage>
            <PageHeader title='Package' />
            <Suspense fallback={<Skeleton h={'60px'} w={'300px'} />}>
                <Await resolve={data.context}>
                    {(context) => (
                        <NativeSelect
                            data={context.projects.map((p) => p.manifest.name!)}
                            w={'300px'}
                            label={'Select package'}
                        />
                    )}
                </Await>
            </Suspense>
            <Box py={20} w={'100%'} h={'100%'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
