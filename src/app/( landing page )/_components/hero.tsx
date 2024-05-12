import React from 'react';
import Image from 'next/image';

import ImageOneDark from '@/assets/images/documents-dark-mode.png';
import ImageOneLight from '@/assets/images/documents-light-mode.png';
import ImageTwoDark from '@/assets/images/reading-dark-mode.png';
import ImageTwoLight from '@/assets/images/reading-light-mode.png';

export const Hero = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center py-4">
      <div className="flex items-center">
        <div className="relative h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px]">
          <Image
            className="hidden object-contain dark:block"
            src={ImageOneDark}
            alt="img-one-dark"
          />
          <Image
            className="block object-contain dark:hidden"
            src={ImageOneLight}
            alt="img-one-light"
          />
        </div>
        <div className="relative hidden h-[400px] w-[400px] md:block">
          <Image
            className="hidden object-contain dark:block"
            src={ImageTwoDark}
            alt="img-two-dark"
          />
          <Image
            className="block object-contain dark:hidden"
            src={ImageTwoLight}
            alt="img-two-light"
          />
        </div>
      </div>
    </div>
  );
};
