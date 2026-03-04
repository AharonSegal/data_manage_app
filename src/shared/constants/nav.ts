import { type NavItem } from '@/shared/types/nav.types';
import { ROUTES } from './routes';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: ROUTES.DASHBOARD,
    section: 'global',
  },
  {
    id: 'activity',
    label: 'Activity Log',
    icon: 'Activity',
    path: ROUTES.ACTIVITY,
    section: 'global',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: ROUTES.SETTINGS,
    section: 'global',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: 'ScrollText',
    path: ROUTES.CERTIFICATES,
    section: 'projects',
    children: [
      {
        id: 'cert-overview',
        label: 'Overview',
        icon: 'BarChart2',
        path: ROUTES.CERTIFICATES_OVERVIEW,
      },
      {
        id: 'cert-data',
        label: 'Data',
        icon: 'Database',
        path: ROUTES.CERTIFICATES_DATA,
        children: [
          {
            id: 'cert-data-entries',
            label: 'All Entries',
            icon: 'List',
            path: ROUTES.CERTIFICATES_DATA_ENTRIES,
          },
          {
            id: 'cert-data-import',
            label: 'Import',
            icon: 'Upload',
            path: ROUTES.CERTIFICATES_DATA_IMPORT,
          },
          {
            id: 'cert-data-history',
            label: 'History',
            icon: 'History',
            path: ROUTES.CERTIFICATES_DATA_HISTORY,
          },
        ],
      },
      {
        id: 'cert-actions',
        label: 'Actions',
        icon: 'Zap',
        path: ROUTES.CERTIFICATES_ACTIONS,
      },
      {
        id: 'cert-notes',
        label: 'Notes',
        icon: 'NotebookPen',
        path: ROUTES.CERTIFICATES_NOTES,
      },
    ],
  },
  {
    id: 'project-b',
    label: 'Project B',
    icon: 'FolderOpen',
    path: ROUTES.PROJECT_B,
    section: 'projects',
    children: [
      {
        id: 'pb-overview',
        label: 'Overview',
        icon: 'BarChart2',
        path: ROUTES.PROJECT_B_OVERVIEW,
      },
      {
        id: 'pb-data',
        label: 'Data',
        icon: 'Database',
        path: ROUTES.PROJECT_B_DATA,
      },
      {
        id: 'pb-actions',
        label: 'Actions',
        icon: 'Zap',
        path: ROUTES.PROJECT_B_ACTIONS,
      },
      {
        id: 'pb-notes',
        label: 'Notes',
        icon: 'NotebookPen',
        path: ROUTES.PROJECT_B_NOTES,
      },
    ],
  },
];
