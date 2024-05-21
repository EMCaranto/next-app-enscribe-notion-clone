'use client';

import React from 'react';
import Link from 'next/link';

import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';

import { Logo } from './logo';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
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
        'fixed left-0 right-0 top-0 z-[50] flex w-full items-center bg-background px-6 py-4',
        scrolled && 'shadow dark:border-b'
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-4 md:justify-end">
        {isLoading && <LoadingSpinner />}
        {isAuthenticated && !isLoading && (
          <div className="flex gap-x-4">
            <div className="flex items-center justify-center md:hidden">
              <UserButton />
            </div>
            <Button className="hidden md:block" size={'sm'} variant={'outline'}>
              <Link href={'/documents'}>
                <span>Dashboard</span>
              </Link>
            </Button>
            <div className="hidden items-center justify-center md:flex">
              <UserButton />
            </div>
          </div>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode={'modal'}>
              <Button size={'sm'} variant={'outline'}>
                <span>Login</span>
              </Button>
            </SignInButton>
            <SignUpButton mode={'modal'}>
              <Button size={'sm'} variant={'default'}>
                <span>Join Enscribe</span>
              </Button>
            </SignUpButton>
          </>
        )}
        <ThemeToggler />
      </div>
    </nav>
  );
};
