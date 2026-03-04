/**
 * PageHeader.tsx — standard page title block.
 *
 * Renders optional breadcrumbs above the title, sets the browser tab title
 * via usePageTitle, and shows an optional subtitle. Use in every page that
 * has a traditional header layout (not notes or dashboard split-panels).
 */

import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  usePageTitle(title);

  return (
    <div className="mb-8">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      )}
    </div>
  );
};
