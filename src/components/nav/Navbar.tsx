import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/server/authOptions';
import NavMenu from './NavMenu';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { buttonVariants } from '../ui/button';
import NavMenuToggle from './NavMenuToggle';
import NavLogo from './NavLogo';
import UserAccountNav from './UserAccountNav';
import { getUserSubscription } from '@/lib/stripe';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const subscription = await getUserSubscription();

  return (
    <>
      <header className="sticky top-0 inset-x-0 w-full z-50">
        <MaxWidthWrapper className="max-w-screen-lg rounded-b-sm backdrop-blur-lg transition-all lg:px-4">
          <div className="flex items-center text-lg justify-between h-14 transition-all">
            <NavLogo />

            <div className="sm:hidden">
              <NavMenuToggle />
            </div>
            <div className="hidden sm:flex items-center sm:space-x-1 lg:space-x-4 ">
              {!session?.user ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  >
                    Sign in
                  </Link>
                  <Link href="/sign-up" className={buttonVariants({ size: 'sm' })}>
                    Get started &rarr;
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm'
                    })}
                  >
                    Dashboard
                  </Link>

                  <UserAccountNav
                    email={session.user.email}
                    imageUrl={session.user.image}
                    name={session.user.name}
                    subscription={subscription}
                  />
                </>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
      <NavMenu isAuth={!!session?.user} subscription={subscription} />
    </>
  );
};

export default Navbar;
