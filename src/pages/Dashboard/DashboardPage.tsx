import { useState } from 'react';
import { ArrowLeft, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { useNotes } from '@/shared/hooks/useNotes';
import { NotesList } from '@/shared/components/NotesEditor/NotesList';
import { NotesEditor } from '@/shared/components/NotesEditor/NotesEditor';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Button } from '@/shared/components/ui/button';

// Dashboard shows ALL notes across every project.
// Creating a note here defaults to 'global' (General).
const DashboardPage = () => {
  const {
    notes,
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
  } = useNotes();
  const isMobile = useIsMobile();
  const [showEditor, setShowEditor] = useState(false);

  const handleSelectNote = (note: Parameters<typeof setSelectedNote>[0]) => {
    setSelectedNote(note);
    if (isMobile) setShowEditor(true);
  };

  const handleCreateNote = () => {
    createNote('global');
    if (isMobile) setShowEditor(true);
    toast.success('New note created');
  };

  const handleDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const snapshot = { ...note };
    deleteNote(id);
    toast('Note deleted', {
      action: { label: 'Undo', onClick: () => restoreNote(snapshot) },
    });
  };

  if (isMobile) {
    if (showEditor && selectedNote) {
      return (
        <div className="flex h-[calc(100vh-49px)] flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-3 bg-[var(--color-surface)]">
            <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              All Notes
            </Button>
          </div>
          <NotesEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={updateNote}
            onRename={renameNote}
            onUpdateTags={updateTags}
            onTogglePin={togglePin}
            onDelete={handleDelete}
            onUpdateProject={updateNoteProject}
          />
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-49px)]">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onTogglePin={togglePin}
          onDeleteNote={handleDelete}
          showProjectLabel
        />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-[280px] shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-col">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onTogglePin={togglePin}
          onDeleteNote={handleDelete}
          showProjectLabel
        />
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-[var(--color-surface)] flex flex-col min-w-0">
        {selectedNote ? (
          <NotesEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={updateNote}
            onRename={renameNote}
            onUpdateTags={updateTags}
            onTogglePin={togglePin}
            onDelete={handleDelete}
            onUpdateProject={updateNoteProject}
          />
        ) : (
          <div className="flex h-full items-center justify-center flex-col gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center mb-2">
              <NotebookPen className="h-7 w-7 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              All notes — across every project
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              New notes created here are saved as General
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
