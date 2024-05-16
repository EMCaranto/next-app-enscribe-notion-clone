'use client';

import React from 'react';

import { ChevronDownIcon } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/clerk-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserSettings = () => {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-full items-center p-3 text-sm" role="button">
          <div className="flex max-w-[200px] items-center gap-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <p className="line-clamp-1 text-start font-medium">
              <span>{user?.firstName}&apos;s Enscribe</span>
            </p>
          </div>
          <ChevronDownIcon className="text-muted-foreground" size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[300px]"
        align="start"
        alignOffset={10}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">
                {user?.fullName}&apos;s Enscribe
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="w-full cursor-pointer text-muted-foreground"
          asChild
        >
          <SignOutButton>Logout</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
