/**
 * SidebarSection.tsx — section label in the sidebar (e.g. "Projects").
 * Thin wrapper around shadcn SidebarGroupLabel for consistent styling.
 */

import { SidebarGroupLabel } from '@/shared/components/ui/sidebar';

interface SidebarSectionProps {
  label: string;
}

export const SidebarSection = ({ label }: SidebarSectionProps) => {
  return <SidebarGroupLabel>{label}</SidebarGroupLabel>;
};
