import { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type Note } from '@/shared/types/note.types';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    content: '[]',
    title: 'Welcome Note',
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true,
    tags: ['welcome', 'getting-started'],
    projectId: 'certificates',
  },
  {
    id: '2',
    content: '[]',
    title: 'Meeting Notes',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    pinned: false,
    tags: ['meeting'],
    projectId: 'certificates',
  },
  {
    id: '3',
    content: '[]',
    title: 'Project B Kickoff',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    pinned: true,
    tags: ['kickoff', 'planning'],
    projectId: 'project-b',
  },
];

interface NotesContextValue {
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  createNote: (projectId: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  getNotesForProject: (projectId: string) => Note[];
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const createNote = (projectId: string) => {
    const newNote: Note = {
      id: uuidv4(),
      content: '[]',
      title: 'Untitled Note',
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      tags: [],
      projectId,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content, updatedAt: new Date() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNote((prev) => (prev?.id === id ? null : prev));
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const getNotesForProject = (projectId: string) =>
    notes.filter((n) => n.projectId === projectId);

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedNote,
        setSelectedNote,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
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
