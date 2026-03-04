import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import { useEffect } from 'react';
import { type Note } from '@/shared/types/note.types';
import { useTheme } from '@/shared/hooks/useTheme';

interface NotesEditorProps {
  note: Note;
  onUpdate: (id: string, content: string) => void;
}

export const NotesEditor = ({ note, onUpdate }: NotesEditorProps) => {
  const { theme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: (() => {
      try {
        const parsed = JSON.parse(note.content);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
      } catch {
        return undefined;
      }
    })(),
  });

  // Sync editor content to context on change
  useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      const content = JSON.stringify(editor.document);
      onUpdate(note.id, content);
    });
    return unsubscribe;
  }, [editor, note.id, onUpdate]);

  return (
    <div className="flex h-full flex-col">
      {/* Note title bar */}
      <div className="border-b border-[var(--color-border)] px-6 py-3">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {note.title || 'Untitled Note'}
        </h2>
      </div>

      {/* BlockNote editor — RTL support for Hebrew */}
      <div dir="auto" className="flex-1 overflow-y-auto">
        <BlockNoteView
          editor={editor}
          theme={theme === 'dark' ? 'dark' : 'light'}
          className="h-full"
        />
      </div>
    </div>
  );
};
