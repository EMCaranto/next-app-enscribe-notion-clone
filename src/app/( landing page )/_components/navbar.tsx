'use client';

import React from 'react';
import Link from 'next/link';

import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';

import { Logo } from './logo';
import { ThemeToggler } from '@/components/shared/theme-toggler';
import { Button } from '@/components/ui/button';

import { useScroll } from '@/hooks/useScroll';

import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const scrolled = useScroll();

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-neutral-50 px-6 py-4 dark:bg-neutral-950',
        scrolled && 'shadow dark:shadow-neutral-900'
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {isLoading && 'Loading...'}
        {isAuthenticated && !isLoading && (
          <>
            <Button size={'sm'} variant={'outline'}>
              <Link href={'/documents'}>Enter Enscribe</Link>
            </Button>
            <UserButton />
          </>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode={'modal'}>
              <Button size={'sm'} variant={'outline'}>
                Log in
              </Button>
            </SignInButton>
            <SignUpButton mode={'modal'}>
              <Button size={'sm'} variant={'default'}>
                Join Enscribe
              </Button>
            </SignUpButton>
          </>
        )}
        <ThemeToggler />
      </div>
    </nav>
  );
};
