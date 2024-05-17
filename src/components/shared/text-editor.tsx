'use client';

import React from 'react';

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';

import { useEdgeStore } from '@/lib/edgestore';

import '@blocknote/core/style.css';

interface TextEditorProps {
  editable?: boolean;
  initialContent?: string;
  onChange: (value: string) => void;
}

export const TextEditor = ({
  editable,
  initialContent,
  onChange,
}: TextEditorProps) => {
  const { edgestore } = useEdgeStore();

  const { resolvedTheme } = useTheme();

  const onUploadHandler = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });

    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: onUploadHandler,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        editable={editable}
        onChange={() => JSON.stringify(editor.topLevelBlocks, null, 2)}
      />
    </div>
  );
};
