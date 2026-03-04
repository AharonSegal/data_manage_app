import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNotes } from '@/shared/hooks/useNotes';
import { NotesList } from '@/shared/components/NotesEditor/NotesList';
import { NotesEditor } from '@/shared/components/NotesEditor/NotesEditor';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Button } from '@/shared/components/ui/button';

const PROJECT_ID = 'project-b';

const NotesPage = () => {
  const { getNotesForProject, selectedNote, setSelectedNote, createNote, updateNote, togglePin } =
    useNotes();
  const isMobile = useIsMobile();
  const [showEditor, setShowEditor] = useState(false);

  const notes = getNotesForProject(PROJECT_ID);

  const handleSelectNote = (note: Parameters<typeof setSelectedNote>[0]) => {
    setSelectedNote(note);
    if (isMobile) setShowEditor(true);
  };

  const handleCreateNote = () => {
    createNote(PROJECT_ID);
    if (isMobile) setShowEditor(true);
  };

  if (isMobile) {
    if (showEditor && selectedNote) {
      return (
        <div className="flex h-[calc(100vh-49px)] flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-3 bg-[var(--color-surface)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditor(false)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Notes
            </Button>
          </div>
          <NotesEditor note={selectedNote} onUpdate={updateNote} />
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
        />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-[280px] shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-col">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onTogglePin={togglePin}
        />
      </div>
      <div className="flex-1 bg-[var(--color-surface)] flex flex-col">
        {selectedNote ? (
          <NotesEditor note={selectedNote} onUpdate={updateNote} />
        ) : (
          <div className="flex h-full items-center justify-center flex-col gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center mb-2">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Select a note or create a new one
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Your notes support rich text, Hebrew, and tags
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
