'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import img_one_dark from '@/assets/images/error-dark-mode.png';
import img_one_light from '@/assets/images/error-light-mode.png';

export default function ErrorPage() {
  return (
    <main className="h-full w-full">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <Image
          className="hidden w-[300px] dark:block md:w-[500px]"
          src={img_one_dark}
          alt="img-one-dark"
          priority
        />
        <Image
          className="block w-[300px] dark:hidden md:w-[500px]"
          src={img_one_light}
          alt="img-one-light"
          priority
        />
        <p className="text-base font-medium md:text-lg">
          Something went wrong!
        </p>
        <Button asChild>
          <Link href={'/documents'}>Go Back</Link>
        </Button>
      </div>
    </main>
  );
}
