/**
 * useTheme.ts — convenience re-export of the useTheme hook.
 * Import from here instead of directly from ThemeContext to keep a
 * stable public API for the hook regardless of where the context lives.
 */

export { useTheme } from '@/shared/context/ThemeContext';
