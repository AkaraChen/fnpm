'use client';

import type { LucideIcon } from 'lucide-react';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export interface NavMainItem {
    title: string;
    url?: string;
    icon: LucideIcon;
    isActive?: boolean;
    onClick?: () => void;
}

export function NavMain({
    items,
}: {
    items: NavMainItem[];
}) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                        <a
                            href={item.url}
                            onClick={() => {
                                item.onClick?.();
                            }}
                        >
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
