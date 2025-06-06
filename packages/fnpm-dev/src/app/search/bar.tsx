'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';

export interface SearchBarProps {
    className?: string;
}

export const SearchBar: FC<SearchBarProps> = (props) => {
    const { className } = props;
    const searchParams = useSearchParams();
    const currentKeyword = searchParams.get('keyword') || '';
    const [keyword, setKeyword] = useState(currentKeyword);
    const router = useRouter();
    const onSubmit = () => {
        const url = new URL('/search', window.location.origin);
        url.searchParams.set('keyword', keyword);
        router.push(`${url.pathname}${url.search}`);
    };
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Input
                placeholder='Search'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit();
                    }
                }}
            />
            <Button onClick={onSubmit}>Search</Button>
        </div>
    );
};
