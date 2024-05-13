'use client';

import React from 'react';
import Link from 'next/link';

import { Logo } from './logo';
import { Button } from '@/components/ui/button';

import { useScroll } from '@/hooks/useScroll';

import { cn } from '@/lib/utils';

export const Navbar = () => {
  const scrolled = useScroll();

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background px-6 py-4',
        scrolled && 'shadow'
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        <Button size={'sm'} variant={'outline'}>
          Join Enscribe
        </Button>
        <span>Theme Toggler</span>
      </div>
    </nav>
  );
};
