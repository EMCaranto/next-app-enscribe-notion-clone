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
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size={'lg'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="flex h-full dark:bg-neutral-900">
      <Sidebar />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
}
