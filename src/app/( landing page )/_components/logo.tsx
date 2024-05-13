import React from 'react';
import Image from 'next/image';

import LogoDarkMode from '@/assets/app_logo/logo-dark-mode.svg';
import LogoLightMode from '@/assets/app_logo/logo-light-mode.svg';

export const Logo = () => {
  return (
    <div className="hidden items-center gap-x-2 md:flex">
      <Image
        className="hidden dark:block"
        src={LogoDarkMode}
        alt="logo-dark"
        height={48}
        width={48}
      />
      <Image
        className="block dark:hidden"
        src={LogoLightMode}
        alt="logo-light"
        height={48}
        width={48}
      />
      <span className="text-xl font-bold">Enscribe</span>
    </div>
  );
};
