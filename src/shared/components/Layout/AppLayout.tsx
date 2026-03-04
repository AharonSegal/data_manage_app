import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/shared/components/Sidebar/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Main content area */}
      <main className="flex flex-1 flex-col min-h-svh bg-[var(--color-bg)] overflow-hidden">
        {/* Mobile top bar with sidebar trigger */}
        <div className="flex items-center gap-2 p-3 border-b border-[var(--color-border)] md:hidden bg-[var(--color-surface)]">
          <SidebarTrigger />
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">DataCenter</span>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};
