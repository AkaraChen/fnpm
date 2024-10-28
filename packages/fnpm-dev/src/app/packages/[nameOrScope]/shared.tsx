import { Code } from '@/app/packages/[nameOrScope]/tabs/code';
import { Dependency } from '@/app/packages/[nameOrScope]/tabs/deps';
import { Manifest } from '@/app/packages/[nameOrScope]/tabs/manifest';
import { AppSidebar } from '@/components/app-sidebar';
import { Card } from '@/components/card';
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
import { fetchFromJsdelivr } from '@/lib/request';
import { cn, wrapFetch } from '@/lib/utils';
import { npmjs } from '@akrc/npm-registry-client';
import {
    SiGnometerminal,
    SiJavascript,
    SiReact,
    SiTypescript,
} from '@icons-pack/react-simple-icons';
import { hasBin, hasReact, hasTypes } from 'fnpm-toolkit';
import humanFormat from 'human-format';
import { LucideBook, LucideFolderCode, LucidePackage } from 'lucide-react';
import { Space_Mono } from 'next/font/google';
import type { FC } from 'react';
import { match } from 'ts-pattern';
import type { PackageJson } from 'type-fest';

export type Tab = 'manifest' | 'code' | 'dependencies';

export interface SearchParams {
    version: string | null;
    tab: Tab | null;
}

interface TagsProps {
    name: string;
    version: string | null;
}

const Tags: FC<TagsProps> = async (props) => {
    const { name, version } = props;
    const pkg: PackageJson = await fetchFromJsdelivr({
        name,
        version,
        path: 'package.json',
    }).then((res) => res.json());
    return (
        <div className={'flex gap-2'}>
            {hasBin(pkg) && <SiGnometerminal color={'#241F31'} size={18} />}
            {hasTypes(pkg) ? (
                <SiTypescript color={'#3178C6'} size={18} />
            ) : (
                <SiJavascript color={'#F7DF1E'} size={18} />
            )}
            {hasReact(pkg) && <SiReact color={'#61DAFB'} size={18} />}
        </div>
    );
};

export interface PackageProps {
    name: string;
    version: string | null;
    tab: Tab | null;
}

const spaceMono = Space_Mono({
    weight: ['400'],
    subsets: ['latin'],
});

export async function Package(props: PackageProps) {
    const { name, version, tab } = props;
    const metadata = await wrapFetch(
        npmjs.GET('/{packageName}', {
            params: {
                path: {
                    packageName: name,
                },
            },
        }),
    );
    const latest = metadata['dist-tags'].latest;
    const current = version ?? latest;
    const releaseAt = new Date(metadata.time[current]);
    const downloadCounts = await wrapFetch(
        npmjs
            .with({
                baseUrl: 'https://api.npmjs.org/',
            })
            .GET('/downloads/range/{period}/{packageName}', {
                params: {
                    path: {
                        period: 'last-week',
                        packageName: name,
                    },
                },
            }),
    );
    const lastweekDownloads = downloadCounts.downloads.reduce(
        (acc, curr) => acc + curr.downloads,
        0,
    );
    return (
        <SidebarProvider>
            <AppSidebar
                workspaces={[
                    {
                        name: 'Manifest',
                        icon: <LucideBook />,
                    },
                    {
                        name: 'Code',
                        icon: <LucideFolderCode />,
                    },
                    {
                        name: 'Dependencies',
                        icon: <LucidePackage />,
                    },
                ]}
            />
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
                                        packages
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
                    <div className='mx-auto h-full w-full max-w-screen-md rounded-xl flex flex-col'>
                        <div>
                            <h1
                                className={
                                    'text-xl font-medium flex gap-2 items-center'
                                }
                            >
                                {name}
                                <Tags name={name} version={current} />
                            </h1>
                            <div
                                className={cn(
                                    spaceMono.className,
                                    'text-sm opacity-50 mb-6',
                                )}
                            >
                                <span>{current}</span>
                                <span className={'opacity-100'}> • </span>
                                <span>
                                    {releaseAt.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className={'opacity-100'}> • </span>
                                <span>
                                    {humanFormat(lastweekDownloads)} downloads
                                </span>
                            </div>

                            {match(tab || 'manifest')
                                .with('manifest', () => (
                                    <Manifest
                                        metadata={metadata}
                                        version={current}
                                    />
                                ))
                                .with('code', () => (
                                    <Card title={'code'}>
                                        <Code
                                            metadata={metadata}
                                            version={current}
                                        />
                                    </Card>
                                ))
                                .with('dependencies', () => (
                                    <Card title={'Dependencies'}>
                                        <Dependency />
                                    </Card>
                                ))
                                .otherwise(() => null)}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
