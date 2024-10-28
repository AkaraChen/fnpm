import { Collapsible } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

export function NavWorkspaces({
    workspaces,
}: {
    workspaces: {
        name: string;
        icon: ReactNode;
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {workspaces.map((workspace) => (
                        <Collapsible key={workspace.name}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a>
                                        {workspace.icon}
                                        <span>{workspace.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
