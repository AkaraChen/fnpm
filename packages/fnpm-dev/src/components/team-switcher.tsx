'use client';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type * as React from 'react';

export function TeamSwitcher({
    team,
}: {
    team: {
        name: string;
        logo: React.ElementType;
    };
}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className='w-fit px-1.5'>
                    <div className='flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground'>
                        <team.logo className='size-3' />
                    </div>
                    <span className='truncate font-semibold'>{team.name}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
