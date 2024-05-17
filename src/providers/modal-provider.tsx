'use client';

import { useEffect, useState } from 'react';

import { CoverImageModal } from '@/components/shared/modal/cover-image-modal';
import { SettingModal } from '@/components/shared/modal/setting-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingModal />
      <CoverImageModal />
    </>
  );
};
