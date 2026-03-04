/**
 * projects.ts — flat list of projects derived from nav.ts.
 *
 * PROJECTS is auto-built from NAV_ITEMS (section: 'projects') plus the
 * hard-coded 'global' (General) entry. Adding a project to nav.ts
 * automatically makes it available in the Notes editor's project selector.
 */

import { NAV_ITEMS } from './nav';

export interface ProjectEntry {
  id: string;
  label: string;
}

// Auto-built from nav.ts — adding a project to nav automatically adds it here
export const PROJECTS: ProjectEntry[] = [
  { id: 'global', label: 'General' },
  ...NAV_ITEMS
    .filter((item) => item.section === 'projects')
    .map((item) => ({ id: item.id, label: item.label })),
];

export const getProjectLabel = (id: string): string =>
  PROJECTS.find((p) => p.id === id)?.label ?? id;
