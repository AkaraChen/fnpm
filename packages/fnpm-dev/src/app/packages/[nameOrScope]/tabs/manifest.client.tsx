'use client';

import { Button } from '@/components/ui/button';
import { devDepsMatchers } from 'fnpm-toolkit';
import { useClipboard } from 'foxact/use-clipboard';
import { LucideTerminal } from 'lucide-react';
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
            <LucideTerminal />
            {command}
        </Button>
    );
};
