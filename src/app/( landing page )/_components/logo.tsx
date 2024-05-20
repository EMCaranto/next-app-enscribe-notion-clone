import React from 'react';
import Image from 'next/image';

import logo_dark_mode from '@/assets/app_logo/logo-dark-mode.svg';
import logo_light_mode from '@/assets/app_logo/logo-light-mode.svg';

export const Logo = () => {
  return (
    <div className="hidden items-center gap-x-2 md:flex">
      <Image
        className="hidden dark:block"
        src={logo_dark_mode}
        alt="logo-dark-mode"
        height={48}
        width={48}
      />
      <Image
        className="block dark:hidden"
        src={logo_light_mode}
        alt="logo-light-mode"
        height={48}
        width={48}
      />
      <span className="text-lg font-semibold tracking-wide">Enscribe</span>
    </div>
  );
};
