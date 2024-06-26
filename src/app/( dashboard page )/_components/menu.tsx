import React from 'react';
import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface MenuProps {
  documentId: Id<'documents'>;
}

export const Menu = ({ documentId }: MenuProps) => {
  const { user } = useUser();

  const router = useRouter();

  const archiveDocument = useMutation(api.documents.onArchiveDocument);

  const onArchiveHandler = () => {
    const promise = archiveDocument({ id: documentId });

    toast.promise(promise, {
      loading: 'Archiving note',
      success: 'Note archived!',
      error: 'Failed to archive note',
    });

    router.push('/documents');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'sm'}>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={onArchiveHandler}>
        <DropdownMenuItem>
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-start gap-x-2 p-2 text-muted-foreground">
          <Avatar className="h-[24px] w-[24px]">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
          <span className="line-clamp-1 text-xs">
            Last edited by: {user?.fullName}
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-6 w-6" />;
};
