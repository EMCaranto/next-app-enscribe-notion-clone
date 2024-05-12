'use client';

import React from 'react';

import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="leading-tight">
          Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
          <span className="underline underline-offset-4">Enscribe</span>
        </span>
      </h1>
      <h3 className="px-4 text-base font-medium sm:text-lg md:px-24 md:py-4 md:text-xl lg:text-2xl">
        Enscribe is the connected workspace where better, faster work happens
      </h3>
      <div>
        <Button>
          <span>Enter Enscribe</span>
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
