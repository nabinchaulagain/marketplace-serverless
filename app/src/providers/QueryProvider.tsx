'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export default function QueryProvider({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const [queryClient] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnMount: false,
                    retry: 0,
                    staleTime: 1000 * 60 * 2,
                    refetchOnWindowFocus: true,
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
