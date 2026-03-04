/**
 * NotesContext.tsx — global notes state backed by Firestore.
 *
 * Keeps a real-time onSnapshot listener on the flat "notes" collection
 * (ordered by updatedAt desc). All CRUD operations write directly to
 * Firestore; the listener reflects changes instantly across tabs.
 * `getNotesForProject(projectId)` filters client-side — no extra queries.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  query,
  orderBy,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { type Note } from '@/shared/types/note.types';

const NOTES_COL = 'notes';

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  createNote: (projectId: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  renameNote: (id: string, title: string) => Promise<void>;
  updateTags: (id: string, tags: string[]) => Promise<void>;
  updateNoteProject: (id: string, projectId: string) => Promise<void>;
  restoreNote: (note: Note) => Promise<void>;
  getNotesForProject: (projectId: string) => Note[];
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, NOTES_COL), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Note[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          content: data.content ?? '[]',
          title: data.title ?? 'Untitled Note',
          createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
          pinned: data.pinned ?? false,
          tags: data.tags ?? [],
          projectId: data.projectId ?? '',
          color: data.color,
        } as Note;
      });
      setNotes(fetched);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Keep selectedNote in sync with Firestore updates
  useEffect(() => {
    setSelectedNote((prev) => {
      if (!prev) return null;
      const updated = notes.find((n) => n.id === prev.id);
      return updated ?? null;
    });
  }, [notes]);

  const createNote = async (projectId: string) => {
    const data = {
      content: '[]',
      title: 'Untitled Note',
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      tags: [],
      projectId,
    };
    const ref = await addDoc(collection(db, NOTES_COL), data);
    setSelectedNote({ id: ref.id, ...data });
  };

  const updateNote = async (id: string, content: string) => {
    await updateDoc(doc(db, NOTES_COL, id), { content, updatedAt: new Date() });
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, NOTES_COL, id));
    setSelectedNote((prev) => (prev?.id === id ? null : prev));
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateDoc(doc(db, NOTES_COL, id), {
      pinned: !note.pinned,
      updatedAt: new Date(),
    });
  };

  const renameNote = async (id: string, title: string) => {
    await updateDoc(doc(db, NOTES_COL, id), { title, updatedAt: new Date() });
  };

  const updateTags = async (id: string, tags: string[]) => {
    await updateDoc(doc(db, NOTES_COL, id), { tags, updatedAt: new Date() });
  };

  const updateNoteProject = async (id: string, projectId: string) => {
    await updateDoc(doc(db, NOTES_COL, id), { projectId, updatedAt: new Date() });
  };

  const restoreNote = async (note: Note) => {
    const { id, ...data } = note;
    await setDoc(doc(db, NOTES_COL, id), {
      ...data,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
    setSelectedNote(note);
  };

  const getNotesForProject = (projectId: string) =>
    notes.filter((n) => n.projectId === projectId);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        selectedNote,
        setSelectedNote,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        renameNote,
        updateTags,
        updateNoteProject,
        restoreNote,
        getNotesForProject,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
};
