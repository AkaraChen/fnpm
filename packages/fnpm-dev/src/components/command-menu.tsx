'use client';

import { IconExternalLink, IconSettings } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { CommandLoading } from 'cmdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { npmjsRegistry, viewOnNpmjs } from '@/lib/npmjs';
import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from './ui/command';
import { DialogTitle } from './ui/dialog';

interface CommandMenuProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const CommandMenu = ({ open, onOpenChange }: CommandMenuProps) => {
    const [openState, setOpenState] = useState(false);
    const [keyword, setKeyword] = useState('');
    const query = useQuery({
        queryKey: ['search', keyword],
        queryFn: async () => {
            const r = await npmjsRegistry.GET('/-/v1/search', {
                params: {
                    query: {
                        text: keyword,
                    },
                },
            });
            return r.data!;
        },
        enabled: keyword.length > 1,
    });
    const navigate = useRouter();
    const submit = (name: string) => {
        if (!name) {
            return;
        }
        setOpenState(false);
        setKeyword('');
        const url = new URL(window.location.href);
        url.pathname = '/search';
        url.searchParams.set('keyword', name);
        navigate.push(url.toString());
    };
    return (
        <CommandDialog
            open={open ?? openState}
            onOpenChange={onOpenChange ?? setOpenState}
            shouldFilter={false}
        >
            <DialogTitle className='sr-only'>Search</DialogTitle>
            <CommandInput
                placeholder='Type a command or search...'
                value={keyword}
                onValueChange={setKeyword}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        submit(keyword);
                    }
                }}
            />
            <CommandList>
                {/* <CommandEmpty>No results found.</CommandEmpty> */}
                {query.isLoading && <CommandLoading />}
                {query.data && (
                    <>
                        <CommandGroup heading='Suggestions'>
                            {query.data.objects.slice(0, 10).map((item) => (
                                <Link
                                    key={item.package.name}
                                    href={`/packages/${item.package.name}`}
                                >
                                    <CommandItem>
                                        <span>{item.package.name}</span>
                                    </CommandItem>
                                </Link>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                    </>
                )}
                <CommandGroup heading='Settings'>
                    <Link href='/settings'>
                        <CommandItem>
                            <IconSettings />
                            <span>Settings</span>
                        </CommandItem>
                    </Link>
                    <CommandItem
                        onClick={() => {
                            viewOnNpmjs(window.location.pathname);
                        }}
                    >
                        <IconExternalLink />
                        <span>View on npm</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
