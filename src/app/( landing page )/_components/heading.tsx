'use client';

import React from 'react';
import Link from 'next/link';

import { SignUpButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { BookDownIcon, LayoutDashboardIcon } from 'lucide-react';

import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4 py-4">
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        <span className="leading-tight">
          Your Ideasm Documents, & Plans. Unified. Welcome to{' '}
          <span className="underline underline-offset-8">Enscribe</span>
        </span>
      </h1>
      <h2 className="px-4 font-medium md:px-24 md:text-2xl">
        <span>
          Enscribe is the connected workspace where better, faster work happens
        </span>
      </h2>
      <div className="flex w-full items-center justify-center">
        {isLoading && (
          <Button>
            <LoadingSpinner />
          </Button>
        )}
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href={'/documents'}>
              <LayoutDashboardIcon className="mr-2" size={16} />
              <span>Enter Enscribe</span>
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignUpButton mode={'modal'}>
            <Button>
              <BookDownIcon className="mr-2" size={16} />
              <span>Get Enscribe</span>
            </Button>
          </SignUpButton>
        )}
      </div>
    </div>
  );
};
