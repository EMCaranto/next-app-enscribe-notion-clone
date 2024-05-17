'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import ImageOneDark from '@/assets/images/error-dark-mode.png';
import ImageOneLight from '@/assets/images/error-light-mode.png';

export default function ErrorPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        className="block h-[300px] w-[300px] dark:hidden"
        src={ImageOneDark}
        alt="img-one-dark"
      />
      <Image
        className="hidden h-[300px] w-[300px] dark:block"
        src={ImageOneLight}
        alt="img-one-light"
      />
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <Button asChild>
        <Link href={'/documents'}>Go Back</Link>
      </Button>
    </div>
  );
}
