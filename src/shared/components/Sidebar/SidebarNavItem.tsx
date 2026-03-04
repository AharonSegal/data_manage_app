/**
 * SidebarNavItem — single navigation item in the sidebar.
 *
 * Renders as a leaf link (SidebarMenuButton) or a collapsible parent
 * with animated children (Framer Motion). Handles depth 0 (top-level)
 * and depth 1+ (sub-items) with the correct shadcn sub-menu components.
 */

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Settings,
  ScrollText,
  BarChart2,
  Database,
  List,
  Upload,
  History,
  Zap,
  NotebookPen,
  FolderOpen,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { type NavItem } from '@/shared/types/nav.types';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Activity,
  Settings,
  ScrollText,
  BarChart2,
  Database,
  List,
  Upload,
  History,
  Zap,
  NotebookPen,
  FolderOpen,
  ChevronRight,
};

interface SidebarNavItemProps {
  item: NavItem;
  depth?: number;
}

export const SidebarNavItem = ({ item, depth = 0 }: SidebarNavItemProps) => {
  const location = useLocation();
  const Icon = ICON_MAP[item.icon] ?? FolderOpen;

  // Check if this item or any of its children is active
  const isActive = location.pathname === item.path;
  const isChildActive =
    item.children?.some(
      (child) =>
        location.pathname === child.path ||
        child.children?.some((grandchild) => location.pathname === grandchild.path)
    ) ?? false;

  const [isOpen, setIsOpen] = useState(isActive || isChildActive);

  // Leaf item (no children) — depth 1 sub-items use SidebarMenuSubButton
  if (!item.children || item.children.length === 0) {
    if (depth > 0) {
      return (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild isActive={isActive}>
            <NavLink to={item.path}>
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <NavLink to={item.path}>
            <Icon />
            <span>{item.label}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Parent item with children
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive || (isChildActive && !isOpen)}
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer select-none"
      >
        <Icon />
        <span className="flex-1">{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronRight className="h-3.5 w-3.5 text-[var(--color-sidebar-section)]" />
        </motion.div>
      </SidebarMenuButton>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarNavItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </SidebarMenuSub>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarMenuItem>
  );
};
