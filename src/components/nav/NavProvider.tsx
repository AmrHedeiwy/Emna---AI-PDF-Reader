import { createContext, useState } from 'react';

export type TNavContext = {
  isOpenNavMenu: boolean;
  toggleNav: () => void;
};

export const NavContext = createContext<TNavContext>({
  isOpenNavMenu: false,
  toggleNav: () => {}
});

interface NavProps {
  children: React.ReactNode;
}

const NavProvider = ({ children }: NavProps) => {
  const [isOpenNavMenu, setIsOpenNavMenu] = useState<boolean>(false);

  const toggleNav = () => {
    const element = document.getElementById('mobile-nav-menu') as HTMLDivElement;

    if (!element) return;

    element.classList.remove('hidden');

    setIsOpenNavMenu((prev) => {
      element.classList.remove(prev ? 'open-nav-menu' : 'close-nav-menu');
      element.classList.add(prev ? 'close-nav-menu' : 'open-nav-menu');
      document.body.style.overflow = prev ? 'auto' : 'hidden';

      return !prev;
    });
  };

  return (
    <NavContext.Provider value={{ toggleNav, isOpenNavMenu }}>
      {children}
    </NavContext.Provider>
  );
};

export default NavProvider;
