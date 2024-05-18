import React from 'react';

import { Navbar } from './_components/navbar';

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-full bg-neutral-50 pt-20 dark:bg-neutral-950">
        {children}
      </main>
    </>
  );
}
