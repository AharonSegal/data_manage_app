/**
 * AppLayout.tsx — main shell for authenticated pages.
 *
 * Renders the collapsible sidebar, the OfflineBar (slides in when offline),
 * and a mobile-only top bar showing the current page name. All page content
 * is rendered via <Outlet />.
 */

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/shared/components/Sidebar/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';
import { OfflineBar } from '@/shared/components/OfflineBar/OfflineBar';
import { useCurrentPageLabel } from '@/shared/hooks/useCurrentPageLabel';

export const AppLayout = () => {
  const pageLabel = useCurrentPageLabel();

  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Main content area */}
      <main className="flex flex-1 flex-col min-h-svh bg-[var(--color-bg)] overflow-hidden">
        {/* Offline indicator — slides in when connection is lost */}
        <OfflineBar />

        {/* Mobile top bar with sidebar trigger */}
        <div className="flex items-center gap-2 p-3 border-b border-[var(--color-border)] md:hidden bg-[var(--color-surface)]">
          <SidebarTrigger />
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{pageLabel}</span>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};
