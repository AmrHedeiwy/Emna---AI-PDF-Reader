'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

const ResendEmailVerification = ({ email }: { email: string }) => {
  const { mutate, isPending } = trpc.auth.resendEmailVerification.useMutation({
    onError(error) {
      if (error.data?.code === 'NOT_FOUND')
        toast.error('User not found', {
          description: 'Please make sure the email exists.'
        });
      else
        toast.error('Something went wrong', { description: 'Please try again later.' });
    },
    onSuccess: () =>
      toast.success('Email sent successfully!', {
        description: 'Please check your email.'
      })
  });

  const resendEmailVerification = useCallback(() => {
    return (_: any) => mutate({ email });
  }, []);

  return (
    <Button className="mt-4" onClick={resendEmailVerification()} disabled={isPending}>
      {isPending ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-6 w-6 text-zinc-300" />
          <p className="font-semibold text-muted">Loading...</p>
        </div>
      ) : (
        'Resend email?'
      )}
    </Button>
  );
};

export default ResendEmailVerification;
