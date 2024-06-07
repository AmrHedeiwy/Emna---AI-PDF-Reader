'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MouseEvent, MouseEventHandler, useCallback } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

const DeleteAccount = ({ className }: { className?: string }) => {
  const router = useRouter();

  const { mutate, isPending } = trpc.auth.deleteUser.useMutation({
    onError(error) {
      if (error.data?.code === 'NOT_FOUND') router.refresh();

      toast.error('Something went wrong', { description: 'Please try again later.' });
    },
    onSuccess: () => signOut({ callbackUrl: '/' })
  });

  const deleteAccount = useCallback(() => {
    return (e: MouseEvent) => {
      e.preventDefault();
      mutate();
    };
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="none"
          className={cn(
            'p-2 justify-start hover:font-semibold hover:text-red-500 w-full hover:bg-red-100 text-sm font-normal',
            className
          )}
        >
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAccount()}
            disabled={isPending}
            className="flex items-center justify-center text-center"
          >
            {isPending ? (
              <div className="flex items-center space-x-2 text-zinc-500">
                <Loader2 className="animate-spin h-6 w-6 " />
                <p className="font-semibold">Loading...</p>
              </div>
            ) : (
              'Continue'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccount;
