import React from 'react';

import { Logo } from './logo';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <div className="z-50 flex w-full items-center bg-neutral-50 p-6 dark:bg-neutral-950">
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
        <Button size={'sm'} variant={'ghost'}>
          Privacy Policy
        </Button>
        <Button size={'sm'} variant={'ghost'}>
          Terms & Condition
        </Button>
      </div>
    </div>
  );
};
