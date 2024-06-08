'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useMutation, useQuery } from 'convex/react';
import { FileIcon, SearchIcon, Trash2Icon, Undo2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ConfirmModal } from '@/components/shared/modal/confirm-modal';
import { Input } from '@/components/ui/input';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export const ArchiveBox = () => {
  const [search, setSearch] = useState('');

  const params = useParams();

  const router = useRouter();

  const deleteDocument = useMutation(api.documents.onDeleteDocument);
  const restoreDocument = useMutation(api.documents.onRestoreDocument);

  const getArchivedDocument = useQuery(api.documents.getArchivedDocument);

  const filteredDocument = getArchivedDocument?.filter((archivedDoc) => {
    return archivedDoc.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClickHandler = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onDeleteHandler = (documentId: Id<'documents'>) => {
    const promise = deleteDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Deleting note',
      success: 'Note deleted!',
      error: 'Failed to delete note',
    });

    if (params.documentId === documentId) {
      router.push('/documents');
    }
  };

  const onRestoreHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    e.stopPropagation();

    const promise = restoreDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring note',
      success: 'Note restored!',
      error: 'Failed to restore note',
    });
  };

  if (getArchivedDocument === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size={'lg'} />
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <div className="flex items-center justify-between">
        <Input
          className="h-8 px-2 focus-visible:ring-transparent"
          placeholder="Search document in Archive"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center justify-center px-[8px]">
          <SearchIcon size={16} />
        </div>
      </div>
      <div className="mt-2">
        <p className="hidden">No document found</p>
        <div className="space-y-[4px]">
          {filteredDocument?.map((document) => (
            <div
              className="group flex w-full items-center self-stretch rounded hover:bg-primary/10 group-hover:text-primary"
              role="button"
              key={document._id}
              onClick={() => onClickHandler(document._id)}
            >
              <div className="flex w-full items-center">
                <div className="w-[36px] px-2">
                  {document.icon ? (
                    document.icon
                  ) : (
                    <FileIcon
                      className="text-muted-foreground group-hover:text-primary"
                      size={20}
                    />
                  )}
                </div>
                <div className="flex w-full items-center justify-start">
                  <span className="truncate text-sm text-muted-foreground group-hover:text-primary">
                    {document.title}
                  </span>
                </div>
                <div className="flex items-center gap-x-[4px] p-[8px]">
                  <div
                    className="flex h-[20px] w-[20px] items-center justify-center rounded hover:bg-primary/25"
                    role="button"
                    onClick={(event) => onRestoreHandler(event, document._id)}
                  >
                    <Undo2Icon className="text-muted-foreground/50" size={16} />
                  </div>
                  <ConfirmModal onConfirm={() => onDeleteHandler(document._id)}>
                    <div
                      className="flex h-[20px] w-[20px] items-center justify-center rounded hover:bg-primary/25"
                      role="button"
                    >
                      <Trash2Icon
                        className="text-muted-foreground/50"
                        size={16}
                      />
                    </div>
                  </ConfirmModal>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
