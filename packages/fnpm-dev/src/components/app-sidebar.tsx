'use client';

import { Command, ExternalLink, Home, Search, Settings2 } from 'lucide-react';
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
import { usePathname } from 'next/navigation';

// This is sample data.
const data = {
    team: {
        name: 'fnpm.dev',
        logo: Command,
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
                if (pathname === '/') {
                    window.open('https://npmjs.com');
                } else if (pathname === '/search') {
                    const keyword =
                        new URLSearchParams(window.location.search).get(
                            'keyword',
                        );
                    if (!keyword) {
                        return;
                    }
                    window.open(`https://npmjs.com/search?q=${keyword}`);
                } else if (pathname.startsWith('/packages/')) {
                    const idx =
                        pathname.indexOf('/packages/') + '/packages/'.length;
                    const packageName = pathname.slice(idx);
                    window.open(`https://npmjs.com/package/${packageName}`);
                }
            },
            isActive: false,
        },
    ];
    return (
        <Sidebar className='border-r-0' {...rest}>
            <SidebarHeader>
                <TeamSwitcher team={data.team} />
                <NavMain items={navMain} />
            </SidebarHeader>
            <SidebarContent>
                {false && (
                    <NavFavorites favorites={data.favorites.slice(0, 3)} />
                )}
                {workspaces && <NavWorkspaces workspaces={workspaces} />}
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
