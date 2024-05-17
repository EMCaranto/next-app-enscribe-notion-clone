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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { edgestore } = useEdgeStore();

  const params = useParams();

  const addCoverImage = useAddCoverImage();

  const onUpdateDoc = useMutation(api.documents.onUpdateDocument);

  const onCloseHandler = () => {
    setFile(undefined);
    setIsSubmitting(false);
    addCoverImage.onClose();
  };

  const onChangeHandler = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: addCoverImage.url,
        },
      });

      await onUpdateDoc({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      onCloseHandler();
    }
  };

  return (
    <Dialog open={addCoverImage.isOpen} onOpenChange={addCoverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          value={file}
          disabled={isSubmitting}
          onChange={onChangeHandler}
        />
      </DialogContent>
    </Dialog>
  );
};
