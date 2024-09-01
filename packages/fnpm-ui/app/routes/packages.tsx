import { Box } from '@mantine/core';
import { Outlet, defer, useLoaderData, useNavigate } from '@remix-run/react';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { ProjectSelector } from '~/components/project-selector';
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
    const navigate = useNavigate();
    return (
        <BasePage>
            <PageHeader title='Package' />
            <ProjectSelector
                promise={data.context}
                onChange={(value) => {
                    const url = `/packages/${encodeURIComponent(value)}`;
                    navigate(url);
                }}
            />
            <Box py={20} w={'100%'} h={'calc(100% - 100px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
