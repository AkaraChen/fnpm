'use client';

import { Tab } from '@/app/packages/[nameOrScope]/shared';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LucideBook, LucideFolderCode, LucidePackage } from 'lucide-react';
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
                        icon: <LucideBook />,
                        href: `/packages/${name}`,
                        active: tab === Tab.Manifest,
                    },
                    {
                        name: 'Code',
                        icon: <LucideFolderCode />,
                        href: `/packages/${name}?tab=${Tab.Code}`,
                        active: tab === Tab.Code,
                    },
                    {
                        name: 'Dependencies',
                        icon: <LucidePackage />,
                        href: `/packages/${name}?tab=${Tab.Dependencies}`,
                        active: tab === Tab.Dependencies,
                    },
                ]}
            />
            <SidebarInset>{props.children}</SidebarInset>
        </SidebarProvider>
    );
}
