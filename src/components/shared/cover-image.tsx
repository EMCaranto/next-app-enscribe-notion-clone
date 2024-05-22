'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useMutation } from 'convex/react';
import { ImageIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useAddCoverImage } from '@/hooks/useAddCover';

import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const CoverImage = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();

  const params = useParams();

  const addCoverImage = useAddCoverImage();

  const removeCoverImage = useMutation(api.documents.onRemoveCoverImage);

  const onRemoveCoverImageHandler = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }

    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    });
  };

  return (
    <div
      className={cn(
        'group relative h-[33.33vh] w-full',
        !url && 'h-[16.66vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && (
        <Image
          className="object-cover"
          src={url}
          alt="cover-img"
          fill
          priority
        />
      )}
      {url && !preview && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 md:flex-row">
          <Button
            className="gap-x-[4px] text-xs text-muted-foreground"
            size={'sm'}
            variant={'ghost'}
            onClick={() => addCoverImage.onReplace(url)}
          >
            <ImageIcon size={16} />
            <span>Change Cover</span>
          </Button>
          <Button
            className="gap-x-[4px] text-xs text-muted-foreground"
            size={'sm'}
            variant={'ghost'}
            onClick={onRemoveCoverImageHandler}
          >
            <XIcon size={16} />
            <span>Remove Cover</span>
          </Button>
        </div>
      )}
    </div>
  );
};

CoverImage.Skeleton = function CoverImageSkeleton() {
  return <Skeleton className="h-[16.66vh] w-full" />;
};
