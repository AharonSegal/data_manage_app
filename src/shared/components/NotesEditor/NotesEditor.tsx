/**
 * NotesEditor — full rich-text editor panel for a single note.
 *
 * Contains an editable title (saves on blur), a tag editor, a project
 * label selector, a toolbar (pin / delete), and the BlockNote block editor
 * with a custom Copy button. Saves are debounced 1 s after the user stops typing.
 */

import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import {
  useCreateBlockNote,
  FormattingToolbar,
  FormattingToolbarController,
  BasicTextStyleButton,
  TextAlignButton,
  ColorStyleButton,
  NestBlockButton,
  UnnestBlockButton,
  CreateLinkButton,
  BlockTypeSelect,
  useBlockNoteEditor,
} from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Pin, Trash2, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TagsInput } from 'react-tag-input-component';
import { type Note } from '@/shared/types/note.types';
import { useTheme } from '@/shared/hooks/useTheme';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { PROJECTS } from '@/shared/constants/projects';

// Copy button — must be rendered inside BlockNoteView to access editor context
const CopySelectionButton = () => {
  const editor = useBlockNoteEditor();
  const [copied, setCopied] = useState(false);

  return (
    <button
      onMouseDown={(e) => {
        // preventDefault keeps the editor selection alive on mousedown
        e.preventDefault();
        const text = editor.getSelectedText();
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      title="Copy selection"
      className="flex items-center justify-center h-7 w-7 rounded hover:bg-[var(--color-sidebar-hover)] transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
      )}
    </button>
  );
};

interface NotesEditorProps {
  note: Note;
  onUpdate: (id: string, content: string) => Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
  onUpdateTags: (id: string, tags: string[]) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onUpdateProject?: (id: string, projectId: string) => Promise<void>;
}

export const NotesEditor = ({
  note,
  onUpdate,
  onRename,
  onUpdateTags,
  onTogglePin,
  onDelete,
  onUpdateProject,
}: NotesEditorProps) => {
  const { theme } = useTheme();
  const [titleValue, setTitleValue] = useState(note.title);
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitleValue(note.title);
  }, [note.id, note.title]);

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

  // Debounced content save
  useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      const content = JSON.stringify(editor.document);
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => {
        onUpdate(note.id, content);
      }, 1000);
    });
    return () => {
      unsubscribe();
      if (updateTimer.current) clearTimeout(updateTimer.current);
    };
  }, [editor, note.id, onUpdate]);

  const handleTitleBlur = useCallback(() => {
    const trimmed = titleValue.trim() || 'Untitled Note';
    if (trimmed !== note.title) onRename(note.id, trimmed);
    setTitleValue(trimmed);
  }, [titleValue, note.id, note.title, onRename]);

  const handleTagsChange = useCallback(
    (tags: string[]) => onUpdateTags(note.id, tags),
    [note.id, onUpdateTags]
  );

  // Delegate delete to the parent page (which owns the undo-toast flow)
  const handleDelete = useCallback(() => {
    onDelete(note.id);
  }, [note.id, onDelete]);

  const handleProjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdateProject?.(note.id, e.target.value);
    },
    [note.id, onUpdateProject]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] px-6 py-4 flex flex-col gap-2">
        {/* Editable title */}
        <input
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Untitled Note"
          className={cn(
            'w-full bg-transparent text-xl font-semibold text-[var(--color-text-primary)]',
            'outline-none border-none placeholder:text-[var(--color-text-tertiary)]',
            'focus:ring-0 p-0 leading-tight'
          )}
        />

        {/* Tag editor */}
        <div className="tags-editor-wrapper">
          <TagsInput
            value={note.tags}
            onChange={handleTagsChange}
            name={`tags-${note.id}`}
            placeHolder="Add tag..."
          />
        </div>

        {/* Toolbar row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: project label selector */}
          {onUpdateProject && (
            <select
              value={note.projectId}
              onChange={handleProjectChange}
              className="h-6 text-[11px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] px-1.5 outline-none focus:border-[var(--color-brand)] transition-colors cursor-pointer"
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          )}

          {/* Right: meta + actions */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[11px] text-[var(--color-text-tertiary)] mr-1">
              Edited {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(note.id)}
              className="h-7 px-2 gap-1.5 text-xs"
            >
              <Pin
                className={cn(
                  'h-3.5 w-3.5',
                  note.pinned
                    ? 'fill-[var(--color-brand)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text-tertiary)]'
                )}
              />
              {note.pinned ? 'Pinned' : 'Pin'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 px-2 gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* BlockNote editor with custom toolbar that includes Copy button */}
      <div dir="auto" className="flex-1 overflow-y-auto">
        <BlockNoteView
          editor={editor}
          theme={theme === 'dark' ? 'dark' : 'light'}
          formattingToolbar={false}
          className="h-full"
        >
          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar>
                <BlockTypeSelect key="blockTypeSelect" />
                <BasicTextStyleButton basicTextStyle="bold" key="bold" />
                <BasicTextStyleButton basicTextStyle="italic" key="italic" />
                <BasicTextStyleButton basicTextStyle="underline" key="underline" />
                <BasicTextStyleButton basicTextStyle="strike" key="strike" />
                <TextAlignButton textAlignment="left" key="alignLeft" />
                <TextAlignButton textAlignment="center" key="alignCenter" />
                <TextAlignButton textAlignment="right" key="alignRight" />
                <ColorStyleButton key="color" />
                <NestBlockButton key="nest" />
                <UnnestBlockButton key="unnest" />
                <CreateLinkButton key="link" />
                <CopySelectionButton key="copy" />
              </FormattingToolbar>
            )}
          />
        </BlockNoteView>
      </div>
    </div>
  );
};
