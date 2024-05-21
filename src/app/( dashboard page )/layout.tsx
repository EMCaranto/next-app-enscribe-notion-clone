'use client';

import React from 'react';
import { redirect } from 'next/navigation';

import { useConvexAuth } from 'convex/react';

import { Sidebar } from './_components/sidebar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { SearchCommand } from '@/components/shared/search-command';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <main className="h-full w-full">
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner size={'lg'} />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <main className="flex h-full w-full">
      <Sidebar />
      <div className="h-full w-full flex-1 items-center justify-center overflow-y-auto">
        <SearchCommand />
        {children}
      </div>
    </main>
  );
}
