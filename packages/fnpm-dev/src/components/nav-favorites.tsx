'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import IconArrowUpRight from '@tabler/icons-react/dist/esm/icons/IconArrowUpRight';
import IconDots from '@tabler/icons-react/dist/esm/icons/IconDots';
import IconExternalLink from '@tabler/icons-react/dist/esm/icons/IconExternalLink';
import IconStarOff from '@tabler/icons-react/dist/esm/icons/IconStarOff';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';

export function NavFavorites({
    favorites,
}: {
    favorites: {
        name: string;
        url: string;
        emoji: string;
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarMenu>
                {favorites.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url} title={item.name}>
                                <span>{item.emoji}</span>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <IconDots />
                                    <span className='sr-only'>More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className='w-56 rounded-lg'
                                side={isMobile ? 'bottom' : 'right'}
                                align={isMobile ? 'end' : 'start'}
                            >
                                <DropdownMenuItem>
                                    <IconStarOff className='text-muted-foreground' />
                                    <span>Remove from Favorites</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <IconExternalLink className='text-muted-foreground' />
                                    <span>Copy Link</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconArrowUpRight className='text-muted-foreground' />
                                    <span>Open in New Tab</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <IconTrash className='text-muted-foreground' />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton className='text-sidebar-foreground/70'>
                        <IconDots />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
