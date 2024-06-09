import React from 'react';
import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  MoreHorizontalIcon,
  Package2Icon,
  PlusIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
  onExpand?: () => void;
  onClick?: () => void;
}

export const SidebarItem = ({
  id,
  icon: Icon,
  documentIcon,
  label,
  active,
  expanded,
  level = 0,
  onExpand,
  onClick,
}: SidebarItemProps) => {
  const { user } = useUser();

  const router = useRouter();

  const archiveDocument = useMutation(api.documents.onArchiveDocument);
  const createDocument = useMutation(api.documents.onCreateDocument);

  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;

  const onArchiveHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (!id) return;

    const promise = archiveDocument({ id }).then(() =>
      router.push('/documents')
    );

    toast.promise(promise, {
      loading: 'Archiving note',
      success: 'Note archived!',
      error: 'Failed to archive note',
    });
  };

  const onCreateHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

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
      loading: 'Creating note',
      success: 'Note created!',
      error: 'Failed to create note',
    });
  };

  const onExpandHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  let levelPadding = 12;

  return (
    <div
      className="group flex min-h-[40px] w-full items-center py-[2px] pr-[12px] text-sm font-medium text-muted-foreground"
      style={{
        paddingLeft: level
          ? `${level * levelPadding + levelPadding}px`
          : `${levelPadding}px`,
      }}
      role="button"
      onClick={onClick}
    >
      <div
        className={cn(
          'flex w-full items-center self-stretch rounded hover:bg-primary/20',
          active && 'bg-primary/10'
        )}
      >
        {!!id && (
          <div
            className={cn(
              'ml-2 flex h-[20px] w-[20px] items-center justify-center rounded hover:bg-primary/20 group-hover:text-primary',
              active && 'bg-primary/10 text-primary hover:bg-primary/20',
              expanded && 'bg-primary/10'
            )}
            role="button"
            onClick={onExpandHandler}
          >
            <ChevronIcon className="shrink-0" size={16} />
          </div>
        )}
        {documentIcon ? (
          <div className="mx-2 shrink-0">{documentIcon}</div>
        ) : (
          <Icon
            className={cn(
              'mx-2 shrink-0 group-hover:text-primary',
              active && 'text-primary'
            )}
            size={16}
          />
        )}
        <span
          className={cn(
            'truncate group-hover:text-primary',
            active && 'text-primary'
          )}
        >
          {label}
        </span>
        {!!id && (
          <div className="ml-auto mr-2 flex items-center gap-x-[4px]">
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <div
                  className="ml-auto flex h-[20px] w-[20px] items-center justify-center rounded opacity-0 hover:bg-primary/20 group-hover:opacity-100"
                  role="button"
                >
                  <MoreHorizontalIcon
                    className="p-[2px] text-muted-foreground hover:text-primary"
                    size={20}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="-mt-[8px] ml-[50px] w-[250px]"
                align="start"
                side="right"
                forceMount
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onArchiveHandler}
                >
                  <div className="flex items-center justify-start gap-x-2 text-xs">
                    <Package2Icon size={16} />
                    <span>Put to Archive Box</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between gap-x-2 p-2 text-muted-foreground">
                  <div className="min-w-[86px]">
                    <p className="line-clamp-1 text-xs">Last edited by:</p>
                  </div>
                  <div className="flex max-w-[118px] items-center justify-end gap-x-[4px]">
                    <Avatar className="h-[16px] w-[16px]">
                      <AvatarImage src={user?.imageUrl} />
                    </Avatar>
                    <p className="line-clamp-1 text-xs">{user?.fullName}</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div
              className="ml-auto flex h-[20px] w-[20px] items-center justify-center rounded opacity-0 hover:bg-primary/20 group-hover:opacity-100"
              role="button"
              onClick={onCreateHandler}
            >
              <PlusIcon
                className="p-[2px] text-muted-foreground hover:text-primary"
                size={20}
              />
            </div>
          </div>
        )}
      </div>
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
