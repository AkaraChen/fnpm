import { Box } from '@mantine/core';
import type { RawContext } from 'fnpm-context';
import type { MetaFunction } from 'react-router';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { ProjectSelector } from '~/components/project-selector';
import { root } from '~/server/config.server';
import { resolveContext } from '~/server/fnpm.server';

export async function loader() {
    const context = resolveContext(root);
    return {
        context,
    };
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Shared',
            description: 'Shared details',
        },
    ];
};

export default function Page() {
    const data = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return (
        <BasePage>
            <PageHeader title='Shared' />
            <ProjectSelector
                promise={data.context as unknown as Promise<RawContext>}
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
