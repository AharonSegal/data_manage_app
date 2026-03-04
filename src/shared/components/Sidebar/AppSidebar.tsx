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

const globalItems = NAV_ITEMS.filter((item) => item.section === 'global');
const projectItems = NAV_ITEMS.filter((item) => item.section === 'projects');

export const AppSidebar = () => {
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

      {/* Footer — Theme Toggle */}
      <SidebarSeparator />
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};
