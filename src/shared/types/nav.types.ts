export interface NavItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  path: string;
  section?: 'global' | 'projects';
  children?: NavItem[];
}
