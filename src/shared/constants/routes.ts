export const ROUTES = {
  DASHBOARD: '/dashboard',
  ACTIVITY: '/activity',
  SETTINGS: '/settings',

  CERTIFICATES: '/certificates',
  CERTIFICATES_OVERVIEW: '/certificates/overview',
  CERTIFICATES_DATA: '/certificates/data',
  CERTIFICATES_DATA_ENTRIES: '/certificates/data/entries',
  CERTIFICATES_DATA_IMPORT: '/certificates/data/import',
  CERTIFICATES_DATA_HISTORY: '/certificates/data/history',
  CERTIFICATES_ACTIONS: '/certificates/actions',
  CERTIFICATES_NOTES: '/certificates/notes',

  PROJECT_B: '/project-b',
  PROJECT_B_OVERVIEW: '/project-b/overview',
  PROJECT_B_DATA: '/project-b/data',
  PROJECT_B_ACTIONS: '/project-b/actions',
  PROJECT_B_NOTES: '/project-b/notes',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
