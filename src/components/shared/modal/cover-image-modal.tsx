'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import { useMutation } from 'convex/react';

import { SingleImageDropzone } from '@/components/shared/edgestore/single-image-dropzone';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

import { useAddCoverImage } from '@/hooks/useAddCover';

import { useEdgeStore } from '@/lib/edgestore';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export const CoverImageModal = () => {
  const [file, setFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);

  const { edgestore } = useEdgeStore();

  const params = useParams();

  const addCoverImage = useAddCoverImage();

  const updateDocument = useMutation(api.documents.onUpdateDocument);

  const onCloseHandler = () => {
    setFile(undefined);
    setSubmitting(false);
    addCoverImage.onClose();
  };

  const onChangeHandler = async (file?: File) => {
    if (file) {
      setFile(file);
      setSubmitting(true);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: addCoverImage.url,
        },
      });

      await updateDocument({
        id: params.documentId as Id<'documents'>,
        cover_image: res.url,
      });

      onCloseHandler();
    }
  };

  return (
    <Dialog open={addCoverImage.isOpen} onOpenChange={addCoverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <span className="text-center text-xs font-semibold md:text-sm">
            Cover Image
          </span>
        </DialogHeader>
        <SingleImageDropzone
          value={file}
          disabled={submitting}
          onChange={onChangeHandler}
        />
      </DialogContent>
    </Dialog>
  );
};
