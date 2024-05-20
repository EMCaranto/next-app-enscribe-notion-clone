'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useMutation, useQuery } from 'convex/react';

import { CoverImage } from '@/components/shared/cover-image';
import { Toolbar } from '@/components/shared/toolbar';
import { Skeleton } from '@/components/ui/skeleton';

import img_one_dark from '@/assets/images/error-dark-mode.png';
import img_one_light from '@/assets/images/error-light-mode.png';

import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

interface PreviewPageProps {
  params: {
    documentId: Id<'documents'>;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const Editor = useMemo(
    () =>
      dynamic(
        () =>
          import('@/components/shared/text-editor').then(
            (module) => module.TextEditor
          ),
        { ssr: false }
      ),
    []
  );

  const getDocumentId = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId,
  });

  const updateDocument = useMutation(api.documents.onUpdateDocument);

  const onChangeHandler = (content: string) => {
    updateDocument({
      id: params.documentId,
      content,
    });
  };

  if (getDocumentId === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <Image
          className="hidden w-[300px] dark:block md:w-[500px]"
          src={img_one_dark}
          alt="img-one-dark"
          priority
        />
        <Image
          className="block w-[300px] dark:hidden md:w-[500px]"
          src={img_one_light}
          alt="img-one-light"
          priority
        />
        <p className="text-base font-medium md:text-lg">
          No preview available!
        </p>
      </div>
    );
  }

  if (getDocumentId === undefined) {
    return (
      <div className="flex h-full w-full flex-col space-y-[40px]">
        <CoverImage.Skeleton />
        <div className="container">
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-4">
              <Skeleton className="h-12 w-12 md:h-20 md:w-20" />
              <Skeleton className=" h-8 w-32 md:h-14 md:w-64" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-4 md:space-y-[20px]">
      <CoverImage url={getDocumentId.cover_image} preview />
      <div className="md:container">
        <Toolbar initialData={getDocumentId} preview />
        <Editor
          initialContent={getDocumentId.content}
          editable={false}
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}
