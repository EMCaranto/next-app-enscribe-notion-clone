import React from 'react';

import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <>
      <main className="min-h-full w-full pt-[80px]">
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
}
