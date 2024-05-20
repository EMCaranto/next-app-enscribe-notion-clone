import React from 'react';

import { Logo } from './logo';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="flex h-20 w-full items-center px-4">
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
        <Button size={'sm'} variant={'ghost'}>
          Privacy Policy
        </Button>
        <Button size={'sm'} variant={'ghost'}>
          Terms & Condition
        </Button>
      </div>
    </footer>
  );
};
