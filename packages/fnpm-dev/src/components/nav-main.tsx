'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { TablerIcon } from '@tabler/icons-react';

export interface NavMainItem {
    title: string;
    url?: string;
    icon: LucideIcon | TablerIcon;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
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
                        {item.url ? (
                            <Link
                                href={item.url}
                                onClick={() => {
                                    item.onClick?.();
                                }}
                                className={cn('cursor-pointer', item.className)}
                            >
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        ) : (
                            <div
                                onClick={() => {
                                    item.onClick?.();
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        item.onClick?.();
                                    }
                                }}
                                className={cn('cursor-pointer', item.className)}
                            >
                                <item.icon />
                                <span>{item.title}</span>
                            </div>
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
