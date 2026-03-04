/**
 * usePageTitle.ts — sets the browser tab title for the current page.
 *
 * Format: "<title> — DataCenter". Resets to "DataCenter" on unmount.
 * Called automatically inside PageHeader, so pages rarely need this directly.
 */

import { useEffect } from 'react';
import { APP_CONFIG } from '@/config/app.config';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} — ${APP_CONFIG.name}`;
    return () => {
      document.title = APP_CONFIG.name;
    };
  }, [title]);
};
