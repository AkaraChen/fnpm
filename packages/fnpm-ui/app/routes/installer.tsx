import { Box } from '@mantine/core';
import { defer } from '@remix-run/node';
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

export default function Installer() {
    return (
        <BasePage>
            <PageHeader title='Installer' />
            <Box py={20} w={'100%'} h={'calc(100% - 60px)'}>
                <Outlet />
            </Box>
        </BasePage>
    );
}
