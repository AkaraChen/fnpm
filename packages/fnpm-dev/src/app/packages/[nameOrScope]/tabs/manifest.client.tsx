'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { urlToAbsolute } from '@/lib/url';
import IconTerminal from '@tabler/icons-react/dist/esm/icons/IconTerminal';
import { devDepsMatchers } from 'fnpm-toolkit';
import { useClipboard } from 'foxact/use-clipboard';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { toast } from 'sonner';

interface CopyCommandProps {
    name: string;
}

export const CopyCommand: FC<CopyCommandProps> = (props) => {
    const { name } = props;
    const command = devDepsMatchers.some((matcher) => matcher.test(name))
        ? `fnpm i ${name} -D`
        : `fnpm i ${name}`;
    const { copy } = useClipboard({
        onCopyError(error) {
            toast.error(error.message);
        },
    });
    return (
        <Button
            variant={'outline'}
            size={'sm'}
            onClick={() => {
                copy(command).then(() => toast.success('Copied to clipboard'));
            }}
        >
            <IconTerminal />
            {command}
        </Button>
    );
};

interface TagBadgeProps {
    tag: string;
}

export const TagBadge: FC<TagBadgeProps> = (props) => {
    const { tag } = props;
    const router = useRouter();
    return (
        <Badge
            key={tag}
            variant={'outline'}
            className={'cursor-pointer'}
            onClick={() => {
                const url = new URL('/search', window.location.origin);
                url.searchParams.set('keyword', tag);
                router.push(urlToAbsolute(url));
            }}
        >
            {tag}
        </Badge>
    );
};
