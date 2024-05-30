'use client';

import Link from 'next/link';
import { Logo } from '../Icons';
import { useContext } from 'react';
import { NavContext } from './NavProvider';

const NavLogo = () => {
  const { isOpenNavMenu, toggleNav } = useContext(NavContext);
  return (
    <Link
      href="/"
      onClick={() => (isOpenNavMenu ? toggleNav() : null)}
      className="ml-2 flex items-center space-x-1.5 lg:ml-0"
    >
      <Logo className="w-10 h-10 mb-0.5" />
      <p className="self-end text-gray-900 font-medium">Emna</p>
    </Link>
  );
};

export default NavLogo;
