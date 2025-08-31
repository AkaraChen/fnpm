'use client';

import {
    IconCommand,
    IconExternalLink,
    IconHome2,
    IconSearch,
    IconSettings,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { useState } from 'react';
import { NavFavorites } from '@/components/nav-favorites';
import { NavMain, type NavMainItem } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import {
    type IWorkspaceMenuItem,
    NavWorkspaces,
} from '@/components/nav-workspaces';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { viewOnNpmjs } from '@/lib/npmjs';
import { CommandMenu } from './command-menu';

// This is sample data.
const data = {
    team: {
        name: 'fnpm.dev',
        logo: IconCommand,
    },
    navSecondary: [
        {
            title: 'Settings',
            url: '/settings',
            icon: IconSettings,
        },
    ],
    favorites: [
        {
            name: 'fnpm',
            url: '#',
            emoji: '📊',
        },
        {
            name: 'pm-combo',
            url: '#',
            emoji: '🍳',
        },
        {
            name: 'hachimi',
            url: '#',
            emoji: '💪',
        },
    ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    workspaces?: IWorkspaceMenuItem[];
}

export function AppSidebar(props: AppSidebarProps) {
    const { workspaces, ...rest } = props;
    const pathname = usePathname();
    const navMain: Array<NavMainItem> = [
        {
            title: 'Search',
            icon: IconSearch,
            isActive: false,
            onClick() {
                setOpen(true);
            },
        },
        {
            title: 'Home',
            url: '/',
            icon: IconHome2,
            isActive: pathname === '/',
        },
        {
            title: 'View on npm',
            icon: IconExternalLink,
            onClick() {
                viewOnNpmjs(pathname);
            },
            isActive: false,
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <Sidebar variant='inset' {...rest}>
            <SidebarHeader>
                <TeamSwitcher team={data.team} />
                <NavMain items={navMain} />
            </SidebarHeader>
            <SidebarContent>
                {false && (
                    <NavFavorites favorites={data.favorites.slice(0, 3)} />
                )}
                {workspaces && <NavWorkspaces workspaces={workspaces} />}
                <CommandMenu open={open} onOpenChange={setOpen} />
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
