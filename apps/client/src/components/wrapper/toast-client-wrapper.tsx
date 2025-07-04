'use client';
import { showToast } from '@repo/ui/lib/toast';
// Show toast on page load
import { useEffect } from 'react';
import type { ExternalToast } from 'sonner';

export type ToastOnPageLoadWrapperProps = {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string | React.ReactNode;
  data?: ExternalToast;
};

export function ToastOnPageLoadWrapper({
  type,
  message,
  data,
}: ToastOnPageLoadWrapperProps) {
  useEffect(() => {
    setTimeout(() => {
      switch (type) {
        case 'info':
          showToast.info(message, data);
          break;
        case 'success':
          showToast.success(message, data);
          break;
        case 'warning':
          showToast.warning(message, data);
          break;
        case 'error':
          showToast.error(message, data);
          break;
        default:
          showToast.info(message, data);
          break;
      }
    }, 100);
  }, [data, message, type]);

  return <></>;
}
