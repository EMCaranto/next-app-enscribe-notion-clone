'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useMutation } from 'convex/react';
import { ImageIcon, XCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

import { useAddCoverImage } from '@/hooks/useAddCover';

import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const CoverImage = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();

  const addCoverImage = useAddCoverImage();

  const params = useParams();

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
        'group relative h-[35vh] w-full',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && (
        <div>
          <Image className="object-cover" src={url} alt="cover-image" fill />
        </div>
      )}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            className="gap-x-2 text-xs text-muted-foreground"
            size={'sm'}
            variant={'outline'}
            onClick={() => addCoverImage.onReplace(url)}
          >
            <ImageIcon size={16} />
            <span>Change Cover</span>
          </Button>
          <Button
            className="gap-x-2 text-xs text-muted-foreground"
            size={'sm'}
            variant={'outline'}
            onClick={onRemoveCoverImageHandler}
          >
            <XCircleIcon size={16} />
            <span>Remove Cover</span>
          </Button>
        </div>
      )}
    </div>
  );
};

CoverImage.Skeleton = function CoverImageSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />;
};
