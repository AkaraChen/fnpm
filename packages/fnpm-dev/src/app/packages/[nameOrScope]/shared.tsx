import { Code } from '@/app/packages/[nameOrScope]/tabs/code';
import { Dependency } from '@/app/packages/[nameOrScope]/tabs/deps';
import { Manifest } from '@/app/packages/[nameOrScope]/tabs/manifest';
import dt from '@/assets/dt.svg';
import { NavActions } from '@/components/nav-actions';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { npmjs } from '@/lib/npmjs';
import { fetchFromJsdelivr } from '@/lib/request';
import { cn } from '@/lib/utils';
import {
    SiGnometerminal,
    SiJavascript,
    SiReact,
    SiTypescript,
} from '@icons-pack/react-simple-icons';
import { getTypesPackage, hasBin, hasReact, hasTypes } from 'fnpm-toolkit';
import humanFormat from 'human-format';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { P, match } from 'ts-pattern';
import type { PackageJson } from 'type-fest';

interface TagsProps {
    name: string;
    version: string | null;
}

export interface SearchParams {
    version: string | null;
    tab: Tab | null;
}

export interface Params {
    nameOrScope: string;
    name?: string;
}

const Tags: FC<TagsProps> = async (props) => {
    const { name, version } = props;
    const pkg: PackageJson = await fetchFromJsdelivr({
        name,
        version,
        path: 'package.json',
    }).then((res) => res.json());
    const haveDts = hasTypes(pkg);
    let haveDt = false;
    if (!haveDts) {
        try {
            await npmjs.GET('/{packageName}', {
                params: {
                    path: {
                        packageName: getTypesPackage(name),
                    },
                },
            });
            haveDt = true;
        } catch {}
    }
    return (
        <div className={'flex gap-2'}>
            {hasBin(pkg) && <SiGnometerminal color={'#241F31'} size={18} />}
            {haveDts ? (
                <SiTypescript color={'#3178C6'} size={18} />
            ) : (
                <SiJavascript color={'#F7DF1E'} size={18} />
            )}
            {haveDt && (
                <Link href={`/packages/@types/${name}`}>
                    <Image src={dt} alt='dt' className='size-[18px]' />
                </Link>
            )}
            {hasReact(pkg) && <SiReact color={'#61DAFB'} size={18} />}
        </div>
    );
};

interface PackageProps {
    name: string;
    version: string | null;
    tab: Tab | null;
}

const spaceMono = Space_Mono({
    weight: ['400'],
    subsets: ['latin'],
});

export enum Tab {
    Manifest = 'manifest',
    Code = 'code',
    Dependencies = 'dependencies',
}

export async function Package(props: PackageProps) {
    const { name, version, tab = Tab.Manifest } = props;
    const metadata = await npmjs
        .GET('/{packageName}', {
            params: {
                path: {
                    packageName: name,
                },
            },
        })
        .then((r) => r.data!);
    const latest = metadata['dist-tags'].latest;
    const current = version ?? latest;
    const releaseAt = new Date(metadata.time[current] as string);
    const downloadCounts = await npmjs
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
        })
        .then((r) => r.data!);
    const lastweekDownloads = downloadCounts.downloads.reduce(
        (acc, curr) => acc + curr.downloads,
        0,
    );
    return (
        <>
            <header className='flex h-14 shrink-0 items-center gap-2'>
                <div className='flex flex-1 items-center gap-2 px-3'>
                    <SidebarTrigger />
                    <Separator orientation='vertical' className='mr-2 h-4' />
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
            <div className='flex flex-1 flex-col gap-4 px-4 py-6'>
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

                        {match(tab)
                            .with(P.union(Tab.Manifest, null), () => (
                                <Manifest
                                    metadata={metadata}
                                    version={current}
                                />
                            ))
                            .with(Tab.Code, () => (
                                <Code metadata={metadata} version={current} />
                            ))
                            .with(Tab.Dependencies, () => (
                                <Dependency
                                    name={name}
                                    metadata={metadata}
                                    version={current}
                                />
                            ))
                            .exhaustive()}
                    </div>
                </div>
            </div>
        </>
    );
}

export const Loading: FC = () => {
    return (
        <div className='flex flex-1 flex-col gap-4 px-4 py-6 mt-14'>
            <Skeleton className='mx-auto h-24 w-full max-w-3xl' />
            <Skeleton className='mx-auto h-full w-full max-w-3xl' />
        </div>
    );
};
