import React from 'react';
import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface SidebarItemProps {
  id?: Id<'documents'>;
  icon: LucideIcon;
  documentIcon?: string;
  label: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  isSearch?: boolean;
  onExpand?: () => void;
  onClick?: () => void;
}

export const SidebarItem = ({
  id,
  documentIcon,
  icon: Icon,
  label,
  active,
  expanded,
  level = 0,
  isSearch,
  onExpand,
  onClick,
}: SidebarItemProps) => {
  const { user } = useUser();

  const router = useRouter();

  const archiveDocument = useMutation(api.documents.onArchiveDocument);
  const createDocument = useMutation(api.documents.onCreateDocument);

  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;

  const onArchiveHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!id) return;

    const promise = archiveDocument({ id }).then(() =>
      router.push('/documents')
    );

    toast.promise(promise, {
      loading: 'Archiving note...',
      success: 'Note has been archived!',
      error: 'Failed to archive note.',
    });
  };

  const onCreateHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!id) return;

    const promise = createDocument({
      title: 'Untitled',
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) {
        onExpand?.();
      }
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };

  const onExpandHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  return (
    <div
      className={cn(
        'group flex min-h-10 w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary'
      )}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : '12px',
      }}
      role="button"
      onClick={onClick}
    >
      {!!id && (
        <div
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          role="button"
          onClick={onExpandHandler}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-lg">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className="text-xs">CTRL + K</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(event) => event.stopPropagation()}
              asChild
            >
              <div
                className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
                role="button"
              >
                <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchiveHandler}>
                <Trash2Icon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            role="button"
            onClick={onCreateHandler}
          >
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

SidebarItem.Skeleton = function SidebarItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <div
      className="flex items-center gap-x-2 py-2"
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
