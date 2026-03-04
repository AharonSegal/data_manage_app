/**
 * note.types.ts — TypeScript interface for a note document.
 * Matches the Firestore "notes" collection schema (timestamps converted to Date by NotesContext).
 */

export interface Note {
  id: string;
  content: string; // BlockNote JSON string
  title: string; // Derived from first block, or "Untitled Note"
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tags: string[];
  projectId: string;
  color?: string;
}
