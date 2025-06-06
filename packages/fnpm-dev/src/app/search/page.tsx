import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { sha256 } from '@/lib/crypto';
import { wrapFetch } from '@/lib/utils';
import { npmjs } from '@akrc/npm-registry-client';
import invariant from 'invariant';
import Link from 'next/link';

interface SearchParams {
    keyword: string;
}

export default async function Page(props: {
    searchParams: Promise<SearchParams>;
}) {
    const { keyword } = await props.searchParams;
    invariant(keyword, 'Keyword is required');
    const result = await wrapFetch(
        npmjs.GET('/-/v1/search', {
            params: {
                query: {
                    text: keyword,
                },
            },
        }),
    );
    return (
        <>
            {result.objects.map(async (item) => {
                const hashedEmail = await sha256(item.package.publisher.email!);
                const avatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}`;
                return (
                    <Link
                        key={item.package.name}
                        className={
                            'flex flex-col gap-2 p-4 bg-background rounded-xl w-full border border-zinc-200'
                        }
                        href={`/packages/${item.package.name}`}
                    >
                        <h3 className={'font-medium text-foreground'}>
                            {item.package.name}
                        </h3>
                        <p className='text-foreground text-sm truncate'>
                            {item.package.description}
                        </p>
                        <div className={'flex gap-2 flex-wrap h-5'}>
                            {item.package.keywords?.slice(0, 3).map((label) => (
                                <Badge key={label} variant={'outline'} className='m-0'>
                                    {label}
                                </Badge>
                            ))}
                        </div>
                        <div className='flex items-center gap-2'>
                            <Avatar className={'rounded-md size-6'}>
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>
                                    {item.package.publisher.name
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className='text-sm opacity-75'>
                                {item.package.publisher.name}
                            </span>
                            <span className={'text-sm opacity-50'}>
                                {new Date(
                                    item.package.date,
                                ).toLocaleDateString()}{' '}
                                • {item.package.version}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}
