import React from 'react';
import Image from 'next/image';

import img_one_dark from '@/assets/images/documents-dark-mode.png';
import img_one_light from '@/assets/images/documents-light-mode.png';
import img_two_dark from '@/assets/images/reading-dark-mode.png';
import img_two_light from '@/assets/images/reading-light-mode.png';

export const Hero = () => {
  return (
    <div className="flex max-w-5xl items-center justify-center py-6">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image
            className="hidden w-[300px] object-contain dark:block md:w-[500px]"
            src={img_one_dark}
            alt="img-one-dark"
            priority
          />
          <Image
            className="block w-[300px] object-contain dark:hidden md:w-[500px]"
            src={img_one_light}
            alt="img-one-light"
            priority
          />
        </div>
        <div className="relative hidden md:block">
          <Image
            className="hidden w-[300px] object-contain dark:block md:w-[500px]"
            src={img_two_dark}
            alt="img-two-dark"
            priority
          />
          <Image
            className="block w-[300px] object-contain dark:hidden md:w-[500px]"
            src={img_two_light}
            alt="img-one-light"
            priority
          />
        </div>
      </div>
    </div>
  );
};
