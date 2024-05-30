'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const SignOutButton = ({ className }: { className?: string }) => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/' })}
      variant="none"
      className={cn(
        'p-2 justify-start hover:font-semibold hover:text-red-600 w-full hover:bg-red-50 text-sm font-normal',
        className
      )}
    >
      Log out
    </Button>
  );
};

export default SignOutButton;
