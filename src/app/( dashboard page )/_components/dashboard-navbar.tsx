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

  const getDocumentId = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<'documents'>,
  });

  if (getDocumentId === null) {
    return null;
  }

  if (getDocumentId === undefined) {
    return (
      <nav className="flex w-full items-center justify-between bg-background px-4 py-[14px]">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-4 py-2">
        {isCollapsed && (
          <MenuIcon
            className="text-muted-foreground hover:text-primary"
            size={24}
            role="button"
            onClick={onResetWidth}
          />
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={getDocumentId} />
          <div className="flex items-center justify-end gap-x-2">
            <Publish initialData={getDocumentId} />
            <Menu documentId={getDocumentId._id} />
          </div>
        </div>
      </nav>
      {getDocumentId.is_archived && (
        <ArchiveBanner documentId={getDocumentId._id} />
      )}
    </>
  );
};
