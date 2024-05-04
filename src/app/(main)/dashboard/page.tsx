'use client';

import { trpc } from '@/app/_trpc/client';

const Page = () => {
  const { data } = trpc.auth.useQuery({ a: 'as' });
  console.log(data);
  return <div> {data?.a}</div>;
};

export default Page;
