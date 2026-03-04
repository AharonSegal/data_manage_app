/**
 * AppSidebar.tsx — main navigation sidebar.
 *
 * Renders the app logo/name header, global nav items, a "Projects" section
 * with project nav items, and a footer with the user avatar and ThemeToggle.
 * Nav items are split from NAV_ITEMS by section at module load time.
 */

import { APP_CONFIG } from '@/config/app.config';
import { NAV_ITEMS } from '@/shared/constants/nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from '@/shared/components/ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSection } from './SidebarSection';
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle';
import { useAuth } from '@/shared/context/AuthContext';

const globalItems = NAV_ITEMS.filter((item) => item.section === 'global');
const projectItems = NAV_ITEMS.filter((item) => item.section === 'projects');

export const AppSidebar = () => {
  const { user } = useAuth();

  return (
    <Sidebar>
      {/* Header — App Name */}
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-brand)] shadow-sm">
            <span className="text-xs font-bold text-white">DC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">
              {APP_CONFIG.name}
            </span>
            <span className="text-[10px] text-[var(--color-sidebar-section)] leading-tight">
              Stage {APP_CONFIG.stage}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main Navigation */}
      <SidebarContent>
        {/* Global items — Dashboard, Activity, Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {globalItems.map((item) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects section */}
        <SidebarGroup>
          <SidebarSection label="Projects" />
          <SidebarGroupContent>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User profile + Theme Toggle */}
      <SidebarSeparator />
      <SidebarFooter>
        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-0.5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? ''}
                className="h-7 w-7 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.displayName?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="text-xs font-medium text-[var(--color-sidebar-text)] truncate">
              {user.displayName ?? user.email}
            </span>
          </div>
        )}
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};
