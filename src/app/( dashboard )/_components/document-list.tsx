'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';

import { SidebarItem } from './sidebar-item';

import { cn } from '@/lib/utils';

import { api } from '../../../../convex/_generated/api';
import { Doc, Id } from '../../../../convex/_generated/dataModel';

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>;
  data?: Doc<'documents'>[];
  level?: number;
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const params = useParams();
  const router = useRouter();

  const documents = useQuery(api.documents.getSidebarDocument, {
    parentDocument: parentDocumentId,
  });

  const onExpandHandler = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirectHandler = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <SidebarItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <SidebarItem.Skeleton level={level} />
            <SidebarItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          'hidden py-2 text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
      >
        {level > 0 && <span>Empty</span>}
      </div>
      {documents.map((document) => (
        <div key={document._id}>
          <SidebarItem
            id={document._id}
            documentIcon={document.icon}
            icon={FileIcon}
            label={document.title}
            active={params.documentId === document._id}
            expanded={expanded[document._id]}
            level={level}
            onExpand={() => onExpandHandler(document._id)}
            onClick={() => onRedirectHandler(document._id)}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
