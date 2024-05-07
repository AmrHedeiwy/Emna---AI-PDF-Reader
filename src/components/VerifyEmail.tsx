'use client';

import { Loader2, XCircle } from 'lucide-react';
import { Email } from './Icons';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { trpc } from '@/app/_trpc/client';

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery(
    { token },
    {
      retry(_, error) {
        return error.data?.code !== 'UNAUTHORIZED';
      },
      refetchOnWindowFocus: false
    }
  );

  if (isError)
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text-muted-foreground text-sm text-center">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );

  if (data?.success)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Email className="w-60 h-60" />

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">
          Thank your for verifying your email.
        </p>

        <Link href="/sign-in" className={buttonVariants({ className: 'mt-4' })}>
          Sign in
        </Link>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
        <h3 className="font-semibold text-xl">Verifying...</h3>
        <p className="text-muted-foreground text-sm text-center">
          This won&apos;t take long.
        </p>
      </div>
    );
};

export default VerifyEmail;
