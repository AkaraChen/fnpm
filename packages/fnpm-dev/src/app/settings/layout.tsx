import type { PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { NavActions } from '@/components/nav-actions';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function ({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className='flex h-14 shrink-0 items-center gap-2'>
                    <div className='flex flex-1 items-center gap-2 px-3'>
                        <SidebarTrigger />
                        <Separator
                            orientation='vertical'
                            className='mr-2 h-4'
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className='line-clamp-1'>
                                        Settings
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className='ml-auto px-3'>
                        <NavActions />
                    </div>
                </header>
                <div className={cn('flex flex-1 flex-col gap-4 px-4 py-6')}>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
