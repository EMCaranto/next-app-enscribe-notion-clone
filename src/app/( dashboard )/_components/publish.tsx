'use client';

import React, { useState } from 'react';

import { useMutation } from 'convex/react';
import { CheckIcon, CopyIcon, GlobeIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useOrigin } from '@/hooks/useOrigin';

import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';

interface PublishProps {
  initialData: Doc<'documents'>;
}

export const Publish = ({ initialData }: PublishProps) => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const origin = useOrigin();

  const originUrl = `${origin}/preview/${initialData._id}`;

  const updateDocument = useMutation(api.documents.onUpdateDocument);

  const onPublishHandler = () => {
    setIsSubmitting(true);

    const promise = updateDocument({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: 'Publishing note...',
      success: 'Note published!',
      error: 'Failed to publish note.',
    });
  };

  const onUnpublishHandler = () => {
    setIsSubmitting(true);

    const promise = updateDocument({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: 'Unpublishing note...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.',
    });
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(originUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} size={'sm'}>
          Publish
          {initialData.is_published && (
            <GlobeIcon className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.is_published ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <GlobeIcon className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note is shared to others.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"
                value={originUrl}
                disabled
              />
              <Button
                className="h-8 rounded-l-none"
                disabled={copied}
                onClick={onCopyHandler}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              size={'sm'}
              disabled={isSubmitting}
              onClick={onUnpublishHandler}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div>
            <GlobeIcon className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="pb-2 text-sm font-medium">Publish this note</p>
            <span className="pb-4 text-xs text-muted-foreground">
              Share you work with others.
            </span>
            <Button
              className="w-full text-xs"
              size={'sm'}
              disabled={isSubmitting}
              onClick={onPublishHandler}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
