'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';

import { ArchiveBanner } from './archive-banner';
import { Menu } from './menu';
import { Publish } from './publish';
import { Title } from './title';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const DashboardNavbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const getDocId = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<'documents'>,
  });

  if (getDocId === null) {
    return null;
  }

  if (getDocId === undefined) {
    return (
      <nav className="items- flex w-full justify-between bg-background px-3 py-2 dark:bg-neutral-900">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-neutral-900">
        {isCollapsed && (
          <MenuIcon
            className="h-6 w-6 text-muted-foreground"
            role="button"
            onClick={onResetWidth}
          />
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={getDocId} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={getDocId} />
            <Menu documentId={getDocId._id} />
          </div>
        </div>
      </nav>
      {getDocId.is_archived && (
        <>
          <ArchiveBanner documentId={getDocId._id} />
        </>
      )}
    </>
  );
};
