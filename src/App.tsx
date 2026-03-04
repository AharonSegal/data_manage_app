import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/shared/context/ThemeContext';
import { NotesProvider } from '@/shared/context/NotesContext';
import { AppLayout } from '@/shared/components/Layout/AppLayout';
import { ROUTES } from '@/shared/constants/routes';

// Pages
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import ActivityLogPage from '@/pages/ActivityLog/ActivityLogPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
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
      // Root redirect
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

      // Global pages
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.ACTIVITY, element: <ActivityLogPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },

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

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider>
      <NotesProvider>
        <Toaster richColors position="bottom-right" />
        <RouterProvider router={router} />
      </NotesProvider>
    </ThemeProvider>
  );
};

export default App;
