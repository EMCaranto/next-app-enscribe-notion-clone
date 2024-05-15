'use client';

import React from 'react';
import { redirect } from 'next/navigation';

import { useConvexAuth } from 'convex/react';

import { Sidebar } from '../_components/sidebar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size={'lg'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="flex h-full bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="h-full flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
