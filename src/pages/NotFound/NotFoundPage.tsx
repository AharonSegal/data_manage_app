/**
 * NotFoundPage.tsx — 404 catch-all route.
 * Shown for any path that doesn't match a defined route.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 p-8">
      <p className="text-8xl font-black text-[var(--color-brand)] opacity-20 select-none">404</p>
      <div className="text-center -mt-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Page not found</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-brand)] text-white text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
