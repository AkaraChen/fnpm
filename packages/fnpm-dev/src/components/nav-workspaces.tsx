import Link from 'next/link';
import type { ReactNode } from 'react';
import { Collapsible } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export interface IWorkspaceMenuItem {
    name: string;
    icon: ReactNode;
    href?: string;
    active?: boolean;
}

export function NavWorkspaces({
    workspaces,
}: {
    workspaces: IWorkspaceMenuItem[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {workspaces.map((workspace) => (
                        <Collapsible key={workspace.name}>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={workspace.active}
                                    asChild
                                >
                                    <Link href={workspace.href || '/'}>
                                        {workspace.icon}
                                        <span>{workspace.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
