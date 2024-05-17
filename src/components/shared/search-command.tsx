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
  const toggle = useSearch((store) => store.toggle);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'k' ||
        (('K' || 'k') && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();
        toggle();
      }
    };
  }, [toggle]);

  if (!isMounted) {
    return null;
  }

  const onSelectHandler = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.firstName}'s Enscribe`} />
      <CommandList>
        <CommandEmpty>
          <span className="text-muted-foreground">No result found</span>
        </CommandEmpty>
        <CommandGroup heading={'Documents'}>
          <div>
            {searchDocument?.map((document) => (
              <CommandItem
                className="gap-x-2"
                key={document._id}
                title={document.title}
                value={document.title}
                onSelect={onSelectHandler}
              >
                {document.icon ? (
                  <span className="text-lg">{document.icon}</span>
                ) : (
                  <FileIcon size={16} />
                )}
                <span>{document.title}</span>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
