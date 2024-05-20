import React from 'react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export default function PreviewLayout({ children }: PreviewLayoutProps) {
  return <main className="h-full w-full">{children}</main>;
}
