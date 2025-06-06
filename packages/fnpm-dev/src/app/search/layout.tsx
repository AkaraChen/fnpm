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
import { Space_Mono } from 'next/font/google';
import type { PropsWithChildren } from 'react';

const spaceMono = Space_Mono({
    weight: ['400'],
    subsets: ['latin'],
});

export default function Layout(props: PropsWithChildren) {
    const { children } = props;
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
                                        Home
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className='ml-auto px-3'>
                        <NavActions />
                    </div>
                </header>
                <div
                    className={cn(
                        'flex flex-1 flex-col gap-4 px-4 py-10',
                        spaceMono.className,
                    )}
                >
                    <div className='mx-auto h-full w-full max-w-screen-lg grid grid-cols-2 gap-4'>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
