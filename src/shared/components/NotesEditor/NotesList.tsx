import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { type Note } from '@/shared/types/note.types';
import { NoteCard } from './NoteCard';
import { Button } from '@/shared/components/ui/button';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onTogglePin: (id: string) => void;
}

export const NotesList = ({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onTogglePin,
}: NotesListProps) => {
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const handleCreateNote = () => {
    onCreateNote();
    toast.success('New note created');
  };

  const handleTogglePin = (id: string, pinned: boolean) => {
    onTogglePin(id);
    toast(pinned ? 'Note unpinned' : 'Note pinned');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Notes ({notes.length})
        </h2>
        <Button
          size="sm"
          onClick={handleCreateNote}
          className="h-7 gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-12">
            <p className="text-sm text-[var(--color-text-secondary)]">No notes yet</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Create your first note to get started
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNote?.id === note.id}
                onSelect={() => onSelectNote(note)}
                onTogglePin={() => handleTogglePin(note.id, note.pinned)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
