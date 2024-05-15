import React from 'react';

import { LoaderCircleIcon } from 'lucide-react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    defaultVariants: {
      size: 'default',
    },
    size: {
      default: 'h-4 w-4',
      sm: 'h-2 w-2',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      icon: 'h-10 w-10',
    },
  },
});

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const LoadingSpinner = ({ size }: LoadingSpinnerProps) => {
  return <LoaderCircleIcon className={cn(spinnerVariants({ size }))} />;
};
