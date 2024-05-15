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
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size={'lg'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="flex h-full w-full bg-red-300 dark:bg-red-500">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
