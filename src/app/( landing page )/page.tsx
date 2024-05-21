import React from 'react';

import { Heading } from './_components/heading';
import { Hero } from './_components/hero';

export default function LandingPage() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Heading />
        <Hero />
      </div>
    </div>
  );
}
