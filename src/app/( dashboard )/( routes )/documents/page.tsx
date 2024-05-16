'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import ImageOneDark from '@/assets/images/empty-dark-mode.png';
import ImageOneLight from '@/assets/images/empty-light-mode.png';

import { api } from '../../../../../convex/_generated/api';

export default function DocumentsPage() {
  const { user } = useUser();

  const router = useRouter();

  const createDoc = useMutation(api.documents.index.createDocument);

  const onCreateDocHandler = () => {
    const promise = createDoc({ title: 'Untitled' }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: 'Creating new note',
      success: 'New note created',
      error: 'Failed to create new note',
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <div className="w-[300px] sm:w-[350px] md:w-[400px]">
        <Image
          className="hidden object-contain dark:block"
          src={ImageOneDark}
          alt="img-one-dark"
        />
        <Image
          className="block object-contain dark:hidden"
          src={ImageOneLight}
          alt="img-one-light"
        />
      </div>
      <p className="text-base font-medium md:text-lg">
        Welcome to {user?.firstName}&apos;s Scribespace
      </p>
      <Button className="gap-x-2" onClick={onCreateDocHandler}>
        <PlusCircleIcon size={16} />
        <span>Create a note</span>
      </Button>
    </div>
  );
}
