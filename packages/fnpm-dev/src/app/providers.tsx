'use client';

import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient();

export const Providers: FC<PropsWithChildren> = (props) => {
    const { children } = props;
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
    );
};
