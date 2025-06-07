'use client';

import {
    Calculator,
    Calendar,
    CreditCard,
    ExternalLink,
    Home,
    LucideCommand,
    Search,
    Settings,
    Settings2,
    Smile,
    User,
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
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { viewOnNpmjs } from '@/lib/npmjs';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { DialogTitle } from './ui/dialog';

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
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <DialogTitle className='sr-only'>Search</DialogTitle>
                    <CommandInput placeholder='Type a command or search...' />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading='Suggestions'>
                            <CommandItem>
                                <Calendar />
                                <span>Calendar</span>
                            </CommandItem>
                            <CommandItem>
                                <Smile />
                                <span>Search Emoji</span>
                            </CommandItem>
                            <CommandItem>
                                <Calculator />
                                <span>Calculator</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading='Settings'>
                            <CommandItem>
                                <User />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <CreditCard />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <Settings />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
