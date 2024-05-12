import React from 'react';

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  return (
    <main className="h-full bg-neutral-50 dark:bg-neutral-950">
      {/** Navbar */}
      {children}
    </main>
  );
}
