'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOut from '../SignOut';
import { useContext } from 'react';
import { NavContext } from './NavProvider';
import { TGetUserSubscription } from '@/lib/stripe';
import DeleteAccount from '../DeleteAccount';

const MobileNav = ({
  isAuth,
  subscription
}: {
  isAuth: boolean;
  subscription: TGetUserSubscription;
}) => {
  const pathname = usePathname();
  const { toggleNav } = useContext(NavContext);

  return (
    <div
      id="mobile-nav-menu"
      className={cn('fixed inset-0 hidden top-14 backdrop-blur-2xl z-40')}
    >
      <div className="flex flex-col items-start space-y-5 m-8">
        {!isAuth && (
          <>
            <Link
              href="/sign-up"
              onClick={() => toggleNav()}
              className={cn(
                'text-muted-foreground',
                pathname === '/sign-up' && 'font-semibold text-green-500'
              )}
            >
              Get started &rarr;
            </Link>
            <Link
              href="/sign-in"
              onClick={() => toggleNav()}
              className={cn(
                'text-muted-foreground',
                pathname === '/sign-in' && 'font-semibold text-green-500'
              )}
            >
              Sign in
            </Link>
            <Link
              href="/pricing"
              onClick={() => toggleNav()}
              className={cn(
                'text-muted-foreground',
                pathname === '/pricing' && 'font-semibold text-green-500'
              )}
            >
              Pricing
            </Link>
          </>
        )}

        {isAuth && (
          <>
            <Link
              href="/dashboard"
              onClick={() => toggleNav()}
              className={cn(
                'text-muted-foreground',
                pathname === '/dashboard' && 'font-semibold text-green-500'
              )}
            >
              Dashboard
            </Link>
            {subscription.isSubscribed ? (
              <Link
                href="/dashboard/billing"
                onClick={() => toggleNav()}
                className={cn(
                  'text-muted-foreground',
                  pathname === '/dashboard/billing' && 'font-semibold text-green-500'
                )}
              >
                Manege Subscription
              </Link>
            ) : (
              <Link
                href="/pricing"
                onClick={() => toggleNav()}
                className={cn(
                  'text-muted-foreground',
                  pathname === '/pricing' && 'font-semibold text-green-500'
                )}
              >
                Pricing
              </Link>
            )}
            <SignOut className="p-0 h-7 text-muted-foreground text-base hover:bg-transparent" />
            <DeleteAccount className="p-0 h-7 text-muted-foreground text-base hover:bg-transparent" />
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
