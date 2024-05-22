'use client';

import React from 'react';

import { ThemeToggler } from '@/components/shared/theme-toggler';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useSettings } from '@/hooks/useSettings';

export const SettingModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-4">
          <h2 className="text-lg font-medium">Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <Label className="text-xs font-semibold md:text-sm">
              Change Theme
            </Label>
            <span className="text-xs text-muted-foreground md:text-sm">
              Adjust the appearance of Enscribe
            </span>
          </div>
          <ThemeToggler />
        </div>
      </DialogContent>
    </Dialog>
  );
};
