'use client';

import { PropsWithChildren, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/app/_trpc/client';
import { absoluteUrl } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import NavProvider from './nav/NavProvider';

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl('/api/trpc'),
          fetch(url, options) {
            return fetch(url, { ...options, credentials: 'include' });
          }
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NavProvider>{children}</NavProvider>
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
