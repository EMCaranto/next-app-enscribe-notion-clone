'use client';

import React from 'react';

import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
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

  const themeModes = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
    auto: Theme.AUTO,
  };

  const theme = (resolvedTheme || 'auto') as keyof typeof themeModes;

  const currentTheme = themeModes[theme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full rounded-xl p-[4px]">
        <EmojiPicker
          className="emoji-size text-sm"
          emojiStyle={EmojiStyle.TWITTER}
          emojiVersion={'5.0'}
          height={350}
          previewConfig={{ showPreview: false }}
          theme={currentTheme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
