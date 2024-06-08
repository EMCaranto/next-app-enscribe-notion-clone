import React from 'react';
import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { ConfirmModal } from '@/components/shared/modal/confirm-modal';
import { Button } from '@/components/ui/button';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface ArchiveBannerProps {
  documentId: Id<'documents'>;
}

export const ArchiveBanner = ({ documentId }: ArchiveBannerProps) => {
  const router = useRouter();

  const deleteDocument = useMutation(api.documents.onDeleteDocument);
  const restoreDocument = useMutation(api.documents.onRestoreDocument);

  const onDeleteHandler = () => {
    const promise = deleteDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Deleting note',
      success: 'Note deleted!',
      error: 'Failed to delete note',
    });

    router.push('/documents');
  };

  const onRestoreHandler = () => {
    const promise = restoreDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring note',
      success: 'Note restored!',
      error: 'Failed to restore note',
    });
  };

  return (
    <div className="flex w-full items-center justify-between gap-x-4 bg-red-500 px-4 py-[4px] md:justify-center">
      <p className="text-xs">This note is in the archive box.</p>
      <div className="flex items-center justify-center gap-x-[4px]">
        <Button
          className="border-none bg-transparent text-sm hover:border-primary hover:bg-red-700"
          size={'sm'}
          variant={'outline'}
          onClick={onRestoreHandler}
        >
          Restore
        </Button>
        <ConfirmModal onConfirm={onDeleteHandler}>
          <Button
            className="border-none bg-transparent text-sm hover:border-primary hover:bg-red-700"
            size={'sm'}
            variant={'outline'}
          >
            Delete
          </Button>
        </ConfirmModal>
      </div>
    </div>
  );
};
