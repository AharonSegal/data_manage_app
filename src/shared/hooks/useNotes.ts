/**
 * useNotes.ts — convenience re-export of the useNotes hook.
 * Import from here instead of directly from NotesContext to keep a
 * stable public API for the hook regardless of where the context lives.
 */

export { useNotes } from '@/shared/context/NotesContext';
