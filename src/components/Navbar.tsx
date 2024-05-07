import Link from 'next/link';
import { Logo } from './Icons';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';

const Navbar = () => {
  return (
    <nav className="sticky h-14 top-0 inset-x-0 w-full z-50 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="ml-2 flex items-center space-x-1.5 lg:ml-0">
            <Logo className="w-10 h-10 mb-0.5" />
            <p className="self-end text-gray-900 font-medium">Emna</p>
          </Link>

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
