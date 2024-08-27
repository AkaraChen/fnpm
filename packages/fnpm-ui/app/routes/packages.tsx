import { Box, NativeSelect, Skeleton } from '@mantine/core';
import {
    Await,
    Outlet,
    defer,
    useLoaderData,
    useNavigate,
    useParams,
} from '@remix-run/react';
import { Suspense } from 'react';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { root } from '~/server/config.server';
import { resolveContext } from '../server/fnpm.server';

export async function loader() {
    const context = resolveContext(root);
    return defer({
        context,
    });
}

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const params = useParams();
    const navigate = useNavigate();
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
                            value={
                                params.name || context.rootProject.manifest.name
                            }
                            onChange={(e) => {
                                const value = e.currentTarget.value;
                                const url = `/packages/${encodeURIComponent(value)}`;
                                navigate(url);
                            }}
                        />
                    )}
                </Await>
            </Suspense>
            <Box py={20} w={'100%'} h={'calc(100% - 100px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
