import { SidebarGroupLabel } from '@/shared/components/ui/sidebar';

interface SidebarSectionProps {
  label: string;
}

export const SidebarSection = ({ label }: SidebarSectionProps) => {
  return <SidebarGroupLabel>{label}</SidebarGroupLabel>;
};
