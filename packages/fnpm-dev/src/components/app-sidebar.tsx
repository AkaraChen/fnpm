'use client';

import {
    ExternalLink,
    Home,
    LucideCommand,
    Search,
    Settings2,
} from 'lucide-react';
import type * as React from 'react';

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
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CommandMenu } from './command-menu';

// This is sample data.
const data = {
    team: {
        name: 'fnpm.dev',
        logo: LucideCommand,
    },
    navSecondary: [
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings2,
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

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    workspaces?: IWorkspaceMenuItem[];
}

export function AppSidebar(props: AppSidebarProps) {
    const { workspaces, ...rest } = props;
    const pathname = usePathname();
    const navMain: Array<NavMainItem> = [
        {
            title: 'Search',
            icon: Search,
            isActive: false,
            onClick() {
                setOpen(true);
            },
        },
        {
            title: 'Home',
            url: '/',
            icon: Home,
            isActive: pathname === '/',
        },
        {
            title: 'View on npm',
            icon: ExternalLink,
            onClick() {
                viewOnNpmjs(pathname);
            },
            isActive: false,
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <Sidebar className='border-r-0' variant='inset' {...rest}>
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
