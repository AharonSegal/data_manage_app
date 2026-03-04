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
