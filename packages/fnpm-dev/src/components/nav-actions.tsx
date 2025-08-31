'use client';

import {
    IconArrowDown,
    IconArrowUp,
    IconBell,
    IconChartAreaLine,
    IconCopy,
    IconCornerUpLeft,
    IconCornerUpRight,
    IconDots,
    IconExternalLink,
    IconFileText,
    IconSettings,
    IconStar,
    IconTrash,
} from '@tabler/icons-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = [
    [
        {
            label: 'Customize Page',
            icon: IconSettings,
        },
        {
            label: 'Turn into wiki',
            icon: IconFileText,
        },
    ],
    [
        {
            label: 'Copy Link',
            icon: IconExternalLink,
        },
        {
            label: 'Duplicate',
            icon: IconCopy,
        },
        {
            label: 'Move to',
            icon: IconCornerUpRight,
        },
        {
            label: 'Move to Trash',
            icon: IconTrash,
        },
    ],
    [
        {
            label: 'Undo',
            icon: IconCornerUpLeft,
        },
        {
            label: 'View analytics',
            icon: IconChartAreaLine,
        },
        {
            label: 'Show delete pages',
            icon: IconTrash,
        },
        {
            label: 'Notifications',
            icon: IconBell,
        },
    ],
    [
        {
            label: 'Import',
            icon: IconArrowUp,
        },
        {
            label: 'Export',
            icon: IconArrowDown,
        },
    ],
];

export function NavActions() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className='flex items-center gap-2 text-sm'>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
                <IconStar />
            </Button>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7 data-[state=open]:bg-accent'
                    >
                        <IconDots />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className='w-56 overflow-hidden rounded-lg p-0'
                    align='end'
                >
                    <Sidebar collapsible='none' className='bg-transparent'>
                        <SidebarContent>
                            {data.map((group) => (
                                <SidebarGroup
                                    key={group
                                        .map((item) => item.label)
                                        .join('')}
                                    className='border-b last:border-none'
                                >
                                    <SidebarGroupContent className='gap-0'>
                                        <SidebarMenu>
                                            {group.map((item) => (
                                                <SidebarMenuItem
                                                    key={item.label}
                                                >
                                                    <SidebarMenuButton>
                                                        <item.icon />{' '}
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            ))}
                        </SidebarContent>
                    </Sidebar>
                </PopoverContent>
            </Popover>
        </div>
    );
}
