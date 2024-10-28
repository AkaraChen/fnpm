import { AppSidebar } from '@/components/app-sidebar';
import { NavActions } from '@/components/nav-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import invariant from 'invariant';
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({
    weight: ['400'],
    subsets: ['latin'],
});

interface SearchParams {
    keyword: string;
}

interface Item {
    name: string;
    description: string;
    labels: string[];
    author: {
        name: string;
        avatar: string;
    };
    lastUpdated: string;
    version: string;
}

const items: Item[] = [
    {
        name: 'fnpm',
        description: 'A package manager for the future.',
        labels: ['featured'],
        author: {
            name: 'TanStack',
            avatar: 'https://avatars.githubusercontent.com/u/54212405?v=4',
        },
        lastUpdated: '1 day ago',
        version: '1.0.0',
    },
    {
        name: 'fnpm-dev',
        description: 'A development environment for fnpm.',
        labels: ['featured'],
        author: {
            name: 'TanStack',
            avatar: 'https://avatars.githubusercontent.com/u/54212405?v=4',
        },
        lastUpdated: '1 day ago',
        version: '1.0.0',
    },
];

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const { keyword } = await props.searchParams;
    invariant(keyword, 'Keyword is required');
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
                    <div className='mx-auto h-full w-full max-w-screen-lg rounded-xl grid grid-cols-2'>
                        {items.map((item) => (
                            <div
                                key={item.name}
                                className={
                                    'flex flex-col gap-2 p-4 bg-background rounded-xl w-full'
                                }
                            >
                                <h3 className={'font-medium text-foreground'}>
                                    {item.name}
                                </h3>
                                <p className='text-foreground text-sm'>
                                    {item.description}
                                </p>
                                <div>
                                    {item.labels.map((label) => (
                                        <Badge key={label}>{label}</Badge>
                                    ))}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Avatar className={'rounded-md size-6'}>
                                        <AvatarImage src={item.author.avatar} />
                                        <AvatarFallback>
                                            {item.author.name
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='text-sm opacity-75'>
                                        {item.author.name}
                                    </span>
                                    <span className={'text-sm opacity-50'}>
                                        {item.lastUpdated} • {item.version}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
