import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import { NotesProvider } from '@/shared/context/NotesContext';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary/ErrorBoundary';
import { AppLayout } from '@/shared/components/Layout/AppLayout';
import { LoginPage } from '@/shared/components/auth/LoginPage';
import { AccessDenied } from '@/shared/components/auth/AccessDenied';
import { ROUTES } from '@/shared/constants/routes';

// Pages
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import ActivityLogPage from '@/pages/ActivityLog/ActivityLogPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
import GlobalNotesPage from '@/pages/Notes/NotesPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';

// Certificates
import CertificatesOverviewPage from '@/pages/projects/Certificates/Overview/OverviewPage';
import AllEntriesPage from '@/pages/projects/Certificates/Data/AllEntries/AllEntriesPage';
import ImportPage from '@/pages/projects/Certificates/Data/Import/ImportPage';
import HistoryPage from '@/pages/projects/Certificates/Data/History/HistoryPage';
import CertActionsPage from '@/pages/projects/Certificates/Actions/ActionsPage';
import CertNotesPage from '@/pages/projects/Certificates/Notes/NotesPage';

// Project B
import PBOverviewPage from '@/pages/projects/ProjectB/Overview/OverviewPage';
import PBDataPage from '@/pages/projects/ProjectB/Data/DataPage';
import PBActionsPage from '@/pages/projects/ProjectB/Actions/ActionsPage';
import PBNotesPage from '@/pages/projects/ProjectB/Notes/NotesPage';

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
      <Toaster richColors position="bottom-right" />
      <RouterProvider router={router} />
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
