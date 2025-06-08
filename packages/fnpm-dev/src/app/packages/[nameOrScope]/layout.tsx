'use client';

import { Tab } from '@/app/packages/[nameOrScope]/shared';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import IconBook from '@tabler/icons-react/dist/esm/icons/IconBook';
import IconCode from '@tabler/icons-react/dist/esm/icons/IconCode';
import IconPackage from '@tabler/icons-react/dist/esm/icons/IconPackage';
import { useParams, useSearchParams } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
    const params = useParams();
    const name = params.name
        ? `${decodeURIComponent(params.nameOrScope as string)}/${params.name}`
        : decodeURIComponent(params.nameOrScope as string);
    const searchParams = useSearchParams();
    const tab = (searchParams.get('tab') as Tab) || Tab.Manifest;
    return (
        <SidebarProvider>
            <AppSidebar
                workspaces={[
                    {
                        name: 'Manifest',
                        icon: <IconBook />,
                        href: `/packages/${name}`,
                        active: tab === Tab.Manifest,
                    },
                    {
                        name: 'Code',
                        icon: <IconCode />,
                        href: `/packages/${name}?tab=${Tab.Code}`,
                        active: tab === Tab.Code,
                    },
                    {
                        name: 'Dependencies',
                        icon: <IconPackage />,
                        href: `/packages/${name}?tab=${Tab.Dependencies}`,
                        active: tab === Tab.Dependencies,
                    },
                ]}
            />
            <SidebarInset>{props.children}</SidebarInset>
        </SidebarProvider>
    );
}
