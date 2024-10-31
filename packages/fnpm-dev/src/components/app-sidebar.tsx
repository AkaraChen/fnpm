'use client';

import {
    Command,
    ExternalLink,
    Home,
    type LucideIcon,
    MessageCircleQuestion,
    Search,
    Settings2,
} from 'lucide-react';
import type * as React from 'react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
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
            url: '#',
            icon: Settings2,
        },
        {
            title: 'Help',
            url: '#',
            icon: MessageCircleQuestion,
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

interface NavMainItem {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
}

export function AppSidebar(props: AppSidebarProps) {
    const { workspaces, ...rest } = props;
    const pathname = usePathname();
    const navMain: Array<NavMainItem> = [
        {
            title: 'Search',
            url: '#',
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
            url: '#',
            icon: ExternalLink,
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
                <NavFavorites favorites={data.favorites.slice(0, 3)} />
                {workspaces && <NavWorkspaces workspaces={workspaces} />}
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
