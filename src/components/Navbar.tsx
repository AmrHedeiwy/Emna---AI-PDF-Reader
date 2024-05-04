import Link from 'next/link';
import { Logo } from './Icons';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';

const Navbar = () => {
  return (
    <nav className="sticky h-14 top-0 inset-x-0 w-full z-50 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14">
          <div className="ml-2 flex items-center space-x-1 lg:ml-0">
            <Logo className="w-12 h-12" />
            <p className="pt-1.5 text-gray-900 font-medium">Emna.</p>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
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
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
