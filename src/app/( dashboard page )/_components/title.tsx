'use client';

import React, { useRef, useState } from 'react';

import { useMutation } from 'convex/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';

interface TitleProps {
  initialData: Doc<'documents'>;
}

export const Title = ({ initialData }: TitleProps) => {
  const [title, setTitle] = useState(initialData.title || 'Untitled');
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const updateDocument = useMutation(api.documents.onUpdateDocument);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    updateDocument({
      id: initialData._id,
      title: event.target.value || 'Untitled',
    });
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
          value={title}
          ref={inputRef}
          onBlur={disableInput}
          onChange={onChangeHandler}
          onClick={enableInput}
          onKeyDown={onKeyDownHandler}
        />
      ) : (
        <Button
          className="h-auto p-1 font-normal"
          variant={'ghost'}
          size={'sm'}
          onClick={enableInput}
        >
          <span>{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};
