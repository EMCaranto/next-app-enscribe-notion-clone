'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { useSearch } from '@/hooks/useSearch';

import { api } from '../../../convex/_generated/api';

export const SearchCommand = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useUser();

  const router = useRouter();

  const searchDocument = useQuery(api.documents.getSearchDocument);

  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSelectHandler = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search on ${user?.firstName}'s Enscribe`} />
      <CommandList className="py-2">
        <CommandEmpty>
          <span className="text-xs text-muted-foreground">No result found</span>
        </CommandEmpty>
        <CommandGroup heading={''}>
          <div className="space-y-[4px]">
            {searchDocument?.map((document) => (
              <CommandItem
                className="flex h-full w-full items-center justify-start gap-x-2"
                key={document._id}
                title={document.title}
                value={document._id}
                onSelect={onSelectHandler}
              >
                {document.icon ? (
                  <span>{document.icon}</span>
                ) : (
                  <FileIcon size={24} />
                )}
                <span className="text-sm font-medium">{document.title}</span>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
