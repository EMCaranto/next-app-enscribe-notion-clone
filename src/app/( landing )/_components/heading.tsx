'use client';

import React from 'react';
import Link from 'next/link';

import { SignUpButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ArrowRightIcon } from 'lucide-react';

import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4 py-4">
      <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="leading-tight">
          Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
          <span className="underline underline-offset-8">Enscribe</span>
        </span>
      </h1>
      <h3 className="px-4 text-base font-medium sm:text-lg md:px-24 md:py-4 md:text-xl lg:text-2xl">
        Enscribe is the connected workspace where better, faster work happens
      </h3>
      <div className="flex w-full items-center justify-center">
        {isLoading && (
          <Button>
            <LoadingSpinner />
          </Button>
        )}
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href={'/documents'}>
              <span>Enter Enscribe</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignUpButton mode={'modal'}>
            <Button>
              <span>Get Enscribe</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </SignUpButton>
        )}
      </div>
    </div>
  );
};
