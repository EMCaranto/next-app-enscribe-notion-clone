'use client';

import React, { ElementRef, useRef, useState } from 'react';

import { useMutation } from 'convex/react';
import { ImagePlusIcon, SmilePlusIcon, XCircleIcon } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

import { IconPicker } from '@/components/shared/icon-picker';
import { Button } from '@/components/ui/button';

import { useAddCoverImage } from '@/hooks/useAddCover';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

interface ToolbarProps {
  initialData: Doc<'documents'>;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const [title, setTitle] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<ElementRef<'textarea'>>(null);

  const addCoverImage = useAddCoverImage();

  const removeIcon = useMutation(api.documents.onRemoveIcon);
  const updateDocument = useMutation(api.documents.onUpdateDocument);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);

    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onIconSelectHandler = (icon: string) => {
    updateDocument({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIconHandler = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  const onInputHandler = (value: string) => {
    setTitle(value);

    updateDocument({
      id: initialData._id,
      title: value || 'Untitled',
    });
  };

  const onKeyDownHandler = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="group relative pl-14">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelectHandler}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            className=" rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant={'outline'}
            size={'icon'}
            onClick={onRemoveIconHandler}
          >
            <XCircleIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelectHandler} asChild>
            <Button
              className="text-xs text-muted-foreground"
              variant={'outline'}
              size={'sm'}
            >
              <SmilePlusIcon className="mr-2 h-4 w-4" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.cover_image && !preview && (
          <Button
            className="text-xs text-muted-foreground"
            variant={'outline'}
            size={'sm'}
            onClick={addCoverImage.onOpen}
          >
            <ImagePlusIcon className="mr-2 h-4 w-4" />
            Add Cover Image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          className="resize-none break-words bg-transparent text-5xl font-bold text-neutral-700 outline-none dark:text-neutral-300"
          ref={inputRef}
          value={title}
          onBlur={disableInput}
          onChange={(event) => onInputHandler(event.target.value)}
          onKeyDown={onKeyDownHandler}
        />
      ) : (
        <div
          className="break-words pb-3 text-5xl font-bold text-neutral-700 outline-none dark:text-neutral-300"
          onClick={enableInput}
        >
          <span>{initialData.title}</span>
        </div>
      )}
    </div>
  );
};
