'use client';

import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { NavContext } from './NavProvider';

const NavMenuToggle = () => {
  const { isOpenNavMenu, toggleNav } = useContext(NavContext);

  return (
    <Button onClick={() => toggleNav()} variant="none" className="transition">
      <X
        className={cn(
          'absolute top-4 right-4 transition-opacity',
          isOpenNavMenu ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Menu
        className={cn(
          'absolute top-4 right-4 transition-opacity',
          isOpenNavMenu ? 'opacity-0' : 'opacity-100'
        )}
      />
    </Button>
  );
};

export default NavMenuToggle;
