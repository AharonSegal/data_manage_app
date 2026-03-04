import { useState } from 'react';
import { Plus, Search, NotebookPen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { type Note } from '@/shared/types/note.types';
import { NoteCard } from './NoteCard';
import { Button } from '@/shared/components/ui/button';
import { useNotes } from '@/shared/context/NotesContext';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
  showProjectLabel?: boolean;
}

export const NotesList = ({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  onDeleteNote,
  showProjectLabel,
}: NotesListProps) => {
  const [search, setSearch] = useState('');
  const { restoreNote } = useNotes();

  const filtered = notes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const pinned = [...filtered]
    .filter((n) => n.pinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const unpinned = [...filtered]
    .filter((n) => !n.pinned)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const handleCreateNote = () => {
    onCreateNote();
  };

  const handleTogglePin = (id: string, wasPinned: boolean) => {
    onTogglePin(id);
    toast(wasPinned ? 'Note unpinned' : 'Note pinned');
  };

  const handleDelete = (note: Note) => {
    const snapshot = { ...note };
    onDeleteNote(note.id);
    toast('Note deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreNote(snapshot),
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Notes
        </h2>
        <Button size="sm" onClick={handleCreateNote} className="h-7 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[var(--color-border)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-tertiary)] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-brand)] transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {filtered.length === 0 ? (
          <EmptyState search={search} onCreateNote={handleCreateNote} />
        ) : (
          <AnimatePresence>
            {pinned.length > 0 && (
              <>
                <SectionHeader label="Pinned" />
                {pinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    onSelect={() => onSelectNote(note)}
                    onTogglePin={() => handleTogglePin(note.id, note.pinned)}
                    onDelete={() => handleDelete(note)}
                    showProjectLabel={showProjectLabel}
                  />
                ))}
              </>
            )}
            {unpinned.length > 0 && (
              <>
                <SectionHeader label={pinned.length > 0 ? 'All Notes' : 'Notes'} />
                {unpinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    onSelect={() => onSelectNote(note)}
                    onTogglePin={() => handleTogglePin(note.id, note.pinned)}
                    onDelete={() => handleDelete(note)}
                    showProjectLabel={showProjectLabel}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <motion.p
    layout
    className="px-1 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] select-none"
  >
    {label}
  </motion.p>
);

const EmptyState = ({
  search,
  onCreateNote,
}: {
  search: string;
  onCreateNote: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
    <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center">
      <NotebookPen className="h-5 w-5 text-[var(--color-text-tertiary)]" />
    </div>
    {search ? (
      <>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">No results</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          No notes match &ldquo;{search}&rdquo;
        </p>
      </>
    ) : (
      <>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">No notes yet</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Create your first note to get started
        </p>
        <Button size="sm" variant="outline" onClick={onCreateNote} className="mt-1 text-xs h-7">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Note
        </Button>
      </>
    )}
  </div>
);
