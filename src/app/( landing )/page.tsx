import React from 'react';

import { Footer } from './_components/footer';
import { Heading } from './_components/heading';
import { Hero } from './_components/hero';

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col px-4">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 text-center md:justify-start">
        <Heading />
        <Hero />
      </div>
      <Footer />
    </div>
  );
}