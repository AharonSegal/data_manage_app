/**
 * nav.types.ts — types for the sidebar navigation tree.
 * NavItem supports infinite nesting via the optional `children` array.
 */

export interface NavItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  path: string;
  section?: 'global' | 'projects';
  children?: NavItem[];
}
