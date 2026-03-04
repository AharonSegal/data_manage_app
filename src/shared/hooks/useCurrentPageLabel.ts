/**
 * useCurrentPageLabel.ts — derives the current page's display name from the URL.
 *
 * Flattens the full NAV_ITEMS tree (including nested children) into a flat
 * list, then matches the current pathname — exact first, longest-prefix fallback.
 * Used by AppLayout to show the page name in the mobile top bar.
 */

import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/shared/constants/nav';
import type { NavItem } from '@/shared/types/nav.types';

const flattenNavItems = (items: NavItem[]): NavItem[] =>
  items.flatMap((item) => [item, ...flattenNavItems(item.children ?? [])]);

const ALL_NAV_ITEMS = flattenNavItems(NAV_ITEMS);

export const useCurrentPageLabel = (): string => {
  const { pathname } = useLocation();

  const exact = ALL_NAV_ITEMS.find((item) => item.path === pathname);
  if (exact) return exact.label;

  const prefix = ALL_NAV_ITEMS
    .filter((item) => pathname.startsWith(item.path) && item.path !== '/')
    .sort((a, b) => b.path.length - a.path.length)[0];

  return prefix?.label ?? 'DataCenter';
};
