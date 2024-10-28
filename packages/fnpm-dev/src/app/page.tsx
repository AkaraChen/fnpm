import { AppSidebar } from '@/components/app-sidebar';
import { NavActions } from '@/components/nav-actions';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
    weight: ['700'],
    subsets: ['latin'],
});

export default function Page() {
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
                <div className='flex flex-1 flex-col gap-4 px-4 py-10'>
                    <div className='mx-auto h-full w-full max-w-3xl rounded-xl flex flex-col items-center'>
                        <h2
                            className={cn(
                                'text-4xl font-semibold text-foreground mt-[20vh]',
                                nunito.className,
                            )}
                        >
                            Welcome to fnpm
                        </h2>
                        <div className='flex w-full max-w-lg items-center space-x-2 mt-8'>
                            <Input placeholder='Search keywords...' />
                            <Button type='submit'>Search</Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
