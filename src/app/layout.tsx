import { Inter } from 'next/font/google';

import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';

import { ConvexClientProvider } from '@/providers/convex-provider';
import { ThemeProvider } from '@/providers/theme-provider';

import '@/stylesheets/globals.css';
import '@/stylesheets/main.css';

const app_font = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Enscribe: Notion Clone',
  description: 'This is just a simple notion clone created with Next JS',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: dark)',
        url: '/svg/app_logo/logo-dark-mode.svg',
        href: '/svg/app_logo/logo-dark-mode.svg',
      },
      {
        media: '(prefers-color-scheme: light)',
        url: '/svg/app_logo/logo-light-mode.svg',
        href: '/svg/app_logo/logo-light-mode.svg',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ConvexClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={app_font.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
