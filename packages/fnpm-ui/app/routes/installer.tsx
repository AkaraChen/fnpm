import { Box } from '@mantine/core';
import { type MetaFunction, defer } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { BasePage } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { root } from '~/server/config.server';
import { resolveContext } from '~/server/fnpm.server';

export async function loader() {
    const context = resolveContext(root);
    return defer({
        context,
    });
}

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Installer',
            description: 'Install packages',
        },
    ];
};

export default function Installer() {
    return (
        <BasePage>
            <PageHeader title='Installer' />
            <Box w={'100%'} h={'calc(100% - 60px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
