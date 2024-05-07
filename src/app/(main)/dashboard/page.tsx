'use client';

import { trpc } from '@/app/_trpc/client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Page = () => {
  const { data, status } = useSession();

  trpc.a.useQuery({ a: 'adas' });

  return <div> </div>;
};

export default Page;
