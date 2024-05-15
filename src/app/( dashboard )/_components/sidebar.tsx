import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isResetting, setIsResetting] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const resizingRef = useRef(false);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const sidebarRef = useRef<ElementRef<'div'>>(null);

  useEffect(() => {
    if (isMobile) {
      onCollapsedHandler();
    } else {
      onResetWidthHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      onCollapsedHandler();
    }
  }, [isMobile, pathname]);

  const onMouseMoveHandler = (event: MouseEvent) => {
    if (!resizingRef.current) return;

    let newWidth = event.clientX;

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

  const onMouseUpHandler = () => {
    resizingRef.current = false;

    document.removeEventListener('mousemove', onMouseMoveHandler);
    document.removeEventListener('mouseup', onMouseUpHandler);
  };

  const onMouseDownHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    resizingRef.current = true;
    document.addEventListener('mousemove', onMouseMoveHandler);
    document.addEventListener('mouseup', onMouseUpHandler);
  };

  const onResetWidthHandler = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const onCollapsedHandler = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('left', '0');
      navbarRef.current.style.setProperty('width', '100%');
    }
  };

  return (
    <>
      <div
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-[240px] flex-col overflow-y-auto bg-green-300',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0'
        )}
        ref={sidebarRef}
      >
        <div
          className={cn(
            'absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-green-500 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100'
          )}
          role="button"
          onClick={onCollapsedHandler}
        >
          <PanelLeftCloseIcon size={24} />
        </div>
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
          onClick={onResetWidthHandler}
          onMouseDown={onMouseDownHandler}
        >
          {/* Draggable Sidebar Handle */}
        </div>
      </div>
      <div
        className={cn(
          'absolute left-[240px] top-0 z-[99999] w-[calc(100%-240px)]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full'
        )}
        ref={navbarRef}
      >
        <nav className="w-full px-3 py-2">
          {isCollapsed && (
            <div
              className="h-6 w-6 text-muted-foreground"
              role="button"
              onClick={onResetWidthHandler}
            >
              <PanelLeftOpenIcon size={24} />
            </div>
          )}
        </nav>
      </div>
    </>
  );
};
