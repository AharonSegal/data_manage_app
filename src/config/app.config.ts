/**
 * app.config.ts — global app constants.
 * Single source of truth for name, version, and stage displayed across the UI.
 */

export const APP_CONFIG = {
  name: 'DataCenter',
  tagline: 'Client Project Management Platform',
  version: '1.1.0',
  stage: 1,
} as const;
