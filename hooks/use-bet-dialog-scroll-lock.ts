import { useEffect } from 'react';

export const useBetDialogScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return;
  }, [isOpen]);
};