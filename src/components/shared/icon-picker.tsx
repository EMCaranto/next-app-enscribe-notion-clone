'use client';

import React from 'react';

import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface IconPickerProps {
  children: React.ReactNode;
  onChange: (icon: string) => void;
  asChild?: boolean;
}

export const IconPicker = ({
  children,
  onChange,
  asChild,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();

  const themeModeMap = {
    light: Theme.LIGHT,
    dark: Theme.DARK,
  };

  const theme = (resolvedTheme || 'light') as keyof typeof themeModeMap;

  const currentTheme = themeModeMap[theme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none">
        <EmojiPicker
          height={350}
          theme={currentTheme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
