'use client';

import React from 'react';

import { SignOutButton, useUser } from '@clerk/clerk-react';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

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
        <div
          className="flex px-2 py-2 text-xs md:px-[4px] md:py-[6px] md:pr-[8px]"
          role="button"
        >
          <div className="flex w-full items-center justify-start rounded hover:bg-primary/10">
            <div className="flex max-w-[250px] items-center gap-x-2 p-[4px]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
              <p className="line-clamp-1 text-start font-medium">
                <span>{user?.firstName}&apos;s Enscribe</span>
              </p>
            </div>
            <ChevronDownIcon className="text-muted-foreground" size={16} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-[8px] w-[350px] rounded px-2 py-2 md:ml-[4px]"
        align="start"
        forceMount
      >
        <div className="flex flex-col space-y-4">
          <div className="flex gap-x-2 rounded border-[1px] border-secondary bg-secondary/50 px-2 py-[12px]">
            <div className="flex items-center justify-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="line-clamp-1 text-sm font-medium">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="w-full cursor-pointer rounded px-4 py-2 text-muted-foreground"
          asChild
        >
          <SignOutButton>
            <div>
              <LogOutIcon size={16} />
              <span className="ml-2">Logout</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
