/**
 * useAuth.ts — convenience re-export of the useAuth hook.
 * Import from here instead of directly from AuthContext to keep a
 * stable public API for the hook regardless of where the context lives.
 */

export { useAuth } from '@/shared/context/AuthContext';
