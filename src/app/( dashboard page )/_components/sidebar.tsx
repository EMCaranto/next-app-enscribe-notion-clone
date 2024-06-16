/* eslint-disable react-hooks/exhaustive-deps */

import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import {
  ArchiveIcon,
  MenuIcon,
  PanelLeftCloseIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

import { ArchiveBox } from './archive-box';
import { DashboardNavbar } from './dashboard-navbar';
import { DocumentList } from './document-list';
import { SidebarItem } from './sidebar-item';
import { UserSettings } from './user-setting';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useSearch } from '@/hooks/useSearch';
import { useSettings } from '@/hooks/useSettings';

import { cn } from '@/lib/utils';

import { api } from '../../../../convex/_generated/api';

export const Sidebar = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [collapsed, setCollapsed] = useState(isMobile);
  const [resetting, setResetting] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const search = useSearch();
  const settings = useSettings();

  const resizingRef = useRef(false);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const sidebarRef = useRef<ElementRef<'div'>>(null);

  const onCreateDocument = useMutation(api.documents.onCreateDocument);

  useEffect(() => {
    if (isMobile) {
      onCollapseHandler();
    } else {
      onResetWidthHandler();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      onCollapseHandler();
    }
  }, [pathname, isMobile]);

  const onMouseDownHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    resizingRef.current = true;

    document.addEventListener('mousemove', onMouseMoveHandler);
    document.addEventListener('mouseup', onMouseUpHandler);
  };

  const onMouseUpHandler = () => {
    resizingRef.current = false;

    document.removeEventListener('mousemove', onMouseMoveHandler);
    document.removeEventListener('mouseup', onMouseUpHandler);
  };

  const onMouseMoveHandler = (e: MouseEvent) => {
    if (!resizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;

      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const onResetWidthHandler = () => {
    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(false);
      setResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';

      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );

      setTimeout(() => setResetting(false), 300);
    }
  };

  const onCollapseHandler = () => {
    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(true);
      setResetting(true);

      sidebarRef.current.style.width = '0';

      navbarRef.current.style.setProperty('left', '0');
      navbarRef.current.style.setProperty('width', '100%');

      setTimeout(() => setResetting(false), 300);
    }
  };

  const onCreateHandler = () => {
    const promise = onCreateDocument({ title: 'Untitled' }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: 'Creating note',
      success: 'Note created!',
      error: 'Failed to create note',
    });
  };

  return (
    <>
      <div
        className={cn(
          'group/sidebar relative z-[50] flex w-[240px] flex-col overflow-hidden bg-secondary ',
          resetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0'
        )}
        ref={sidebarRef}
      >
        <div
          className={cn(
            'absolute right-[14px] top-[14px] z-[50] rounded-sm text-muted-foreground opacity-0 transition hover:bg-transparent group-hover/sidebar:opacity-100 dark:hover:bg-transparent dark:hover:text-primary',
            isMobile && 'opacity-100'
          )}
          role="button"
          onClick={onCollapseHandler}
        >
          <PanelLeftCloseIcon size={24} />
        </div>
        <div className="flex h-screen flex-col">
          <div className="flex-shrink-0">
            <UserSettings />
            <SidebarItem
              icon={SearchIcon}
              label="Search"
              onClick={search.onOpen}
            />
            <SidebarItem
              icon={SettingsIcon}
              label="Settings"
              onClick={settings.onOpen}
            />
            <SidebarItem
              icon={PlusCircleIcon}
              label="Create a note"
              onClick={onCreateHandler}
            />
          </div>
          <div className="sidebar-scrollbar flex-grow overflow-y-auto py-2">
            <DocumentList />
            <Popover>
              <PopoverTrigger className="mt-4 w-full">
                <SidebarItem icon={ArchiveIcon} label="Archive" />
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-0"
                side={isMobile ? 'bottom' : 'right'}
              >
                <ArchiveBox />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div
          className="absolute bottom-auto right-0 top-0 min-h-full w-[2px] cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
          onClick={onResetWidthHandler}
          onMouseDown={onMouseDownHandler}
        >
          {/* Placeholder */}
        </div>
      </div>
      <div
        className={cn(
          'absolute left-[240px] top-0 z-[50] w-[calc(100%-240px)]',
          resetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full'
        )}
        ref={navbarRef}
      >
        {!!params.documentId ? (
          <DashboardNavbar
            isCollapsed={collapsed}
            onResetWidth={onResetWidthHandler}
          />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {collapsed && (
              <MenuIcon
                className="h-6 w-6 text-muted-foreground"
                role="button"
                onClick={onResetWidthHandler}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
