/**
 * App.tsx — root component.
 *
 * Wraps the app in ThemeProvider → AuthProvider → ErrorBoundary.
 * Auth gate: unauthenticated users see LoginPage; non-admin users see
 * AccessDenied. Authenticated admins get the full app with lazy-loaded
 * page routes (NotesProvider + ActivityProvider + RouterProvider).
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import { NotesProvider } from '@/shared/context/NotesContext';
import { ActivityProvider } from '@/shared/context/ActivityContext';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary/ErrorBoundary';
import { AppLayout } from '@/shared/components/Layout/AppLayout';
import { LoginPage } from '@/shared/components/auth/LoginPage';
import { AccessDenied } from '@/shared/components/auth/AccessDenied';
import { ROUTES } from '@/shared/constants/routes';

// Suspense fallback
const SkeletonFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)]">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" />
  </div>
);

// Pages — lazy loaded for code splitting
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const ActivityLogPage = lazy(() => import('@/pages/ActivityLog/ActivityLogPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));
const GlobalNotesPage = lazy(() => import('@/pages/Notes/NotesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const GamePage     = lazy(() => import('@/pages/Game/GamePage'));

// Certificates
const CertificatesOverviewPage = lazy(() => import('@/pages/projects/Certificates/Overview/OverviewPage'));
const AllEntriesPage = lazy(() => import('@/pages/projects/Certificates/Data/AllEntries/AllEntriesPage'));
const ImportPage = lazy(() => import('@/pages/projects/Certificates/Data/Import/ImportPage'));
const HistoryPage = lazy(() => import('@/pages/projects/Certificates/Data/History/HistoryPage'));
const CertActionsPage = lazy(() => import('@/pages/projects/Certificates/Actions/ActionsPage'));
const CertNotesPage = lazy(() => import('@/pages/projects/Certificates/Notes/NotesPage'));

// Project B
const PBOverviewPage = lazy(() => import('@/pages/projects/ProjectB/Overview/OverviewPage'));
const PBDataPage = lazy(() => import('@/pages/projects/ProjectB/Data/DataPage'));
const PBActionsPage = lazy(() => import('@/pages/projects/ProjectB/Actions/ActionsPage'));
const PBNotesPage = lazy(() => import('@/pages/projects/ProjectB/Notes/NotesPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

      // Global pages
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.ACTIVITY, element: <ActivityLogPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
      { path: ROUTES.NOTES, element: <GlobalNotesPage /> },
      { path: ROUTES.GAME, element: <GamePage /> },

      // Certificates
      { path: ROUTES.CERTIFICATES, element: <Navigate to={ROUTES.CERTIFICATES_OVERVIEW} replace /> },
      { path: ROUTES.CERTIFICATES_OVERVIEW, element: <CertificatesOverviewPage /> },
      { path: ROUTES.CERTIFICATES_DATA, element: <Navigate to={ROUTES.CERTIFICATES_DATA_ENTRIES} replace /> },
      { path: ROUTES.CERTIFICATES_DATA_ENTRIES, element: <AllEntriesPage /> },
      { path: ROUTES.CERTIFICATES_DATA_IMPORT, element: <ImportPage /> },
      { path: ROUTES.CERTIFICATES_DATA_HISTORY, element: <HistoryPage /> },
      { path: ROUTES.CERTIFICATES_ACTIONS, element: <CertActionsPage /> },
      { path: ROUTES.CERTIFICATES_NOTES, element: <CertNotesPage /> },

      // Project B
      { path: ROUTES.PROJECT_B, element: <Navigate to={ROUTES.PROJECT_B_OVERVIEW} replace /> },
      { path: ROUTES.PROJECT_B_OVERVIEW, element: <PBOverviewPage /> },
      { path: ROUTES.PROJECT_B_DATA, element: <PBDataPage /> },
      { path: ROUTES.PROJECT_B_ACTIONS, element: <PBActionsPage /> },
      { path: ROUTES.PROJECT_B_NOTES, element: <PBNotesPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" />
  </div>
);

const AppContent = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Not signed in → login page
  if (!user) {
    return (
      <>
        <Toaster richColors position="bottom-right" />
        <LoginPage />
      </>
    );
  }

  // Signed in but not admin → 404 wall
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Authenticated admin → full app
  return (
    <NotesProvider>
      <ActivityProvider>
        <Toaster richColors position="bottom-right" />
        <Suspense fallback={<SkeletonFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </ActivityProvider>
    </NotesProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
