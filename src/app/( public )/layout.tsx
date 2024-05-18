import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <div className="h-full dark:bg-neutral-900">{children}</div>;
};

export default PublicLayout;
