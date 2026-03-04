/**
 * Breadcrumbs.tsx — automatic breadcrumb trail from the current URL.
 *
 * Builds a flat path → label map from NAV_ITEMS at module load time (static,
 * so no recalculation per render). Accumulates path segments and renders
 * clickable links for all but the last segment. Returns null on top-level
 * routes (≤1 crumb) to avoid clutter on Dashboard, Settings, etc.
 */

import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '@/shared/constants/nav';
import type { NavItem } from '@/shared/types/nav.types';

// Build a flat map of path → label from the full nav tree
const buildPathLabelMap = (items: NavItem[], map: Record<string, string> = {}): Record<string, string> => {
  for (const item of items) {
    map[item.path] = item.label;
    if (item.children) buildPathLabelMap(item.children, map);
  }
  return map;
};

const PATH_LABEL_MAP = buildPathLabelMap(NAV_ITEMS);

interface Crumb {
  label: string;
  path: string;
}

const buildBreadcrumbs = (pathname: string): Crumb[] => {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];

  let accumulated = '';
  for (const segment of segments) {
    accumulated += '/' + segment;
    const label = PATH_LABEL_MAP[accumulated];
    if (label) crumbs.push({ label, path: accumulated });
  }

  return crumbs;
};

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const crumbs = buildBreadcrumbs(pathname);

  // Don't show breadcrumbs on top-level pages (0 or 1 crumb)
  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 mb-3 text-xs text-[var(--color-text-tertiary)]">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
            {isLast ? (
              <span className="text-[var(--color-text-secondary)] font-medium">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-[var(--color-text-primary)] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};
