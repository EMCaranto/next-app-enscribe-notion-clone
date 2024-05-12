import { Inter } from 'next/font/google';

import type { Metadata } from 'next';

import '@/stylesheets/main.css';
import '@/stylesheets/globals.css';

const app_font = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={app_font.className}>
        <>{children}</>
      </body>
    </html>
  );
}
