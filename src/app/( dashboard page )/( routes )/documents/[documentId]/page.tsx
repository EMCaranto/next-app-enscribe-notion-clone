'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import { useMutation, useQuery } from 'convex/react';

import { CoverImage } from '@/components/shared/cover-image';
import { Toolbar } from '@/components/shared/toolbar';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

interface DocumentPageProps {
  params: {
    documentId: Id<'documents'>;
  };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const Editor = useMemo(
    () =>
      dynamic(
        () =>
          import('@/components/shared/text-editor').then(
            (mod) => mod.TextEditor
          ),
        {
          ssr: false,
        }
      ),
    []
  );

  const getDocumentId = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId,
  });

  const onUpdateDoc = useMutation(api.documents.onUpdateDocument);

  const onChangeHandler = (content: string) => {
    onUpdateDoc({
      id: params.documentId,
      content,
    });
  };

  if (getDocumentId === null) {
    return <div>Not found</div>;
  }

  if (getDocumentId === undefined) {
    return (
      <div>
        <CoverImage.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  console.log('Document Cover Image: ' + getDocumentId);

  return (
    <div className="pb-40">
      <CoverImage url={getDocumentId.cover_image} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={getDocumentId} />
        <Editor
          initialContent={getDocumentId.content}
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}
