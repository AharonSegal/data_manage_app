/**
 * NoteCard.tsx — single note card in the NotesList.
 *
 * Shows title, content preview (first ~60 chars), tag chips (max 2 + overflow
 * badge), relative timestamp, and hover-revealed pin / delete buttons.
 * Selected and pinned states are indicated with a colored left border.
 */

import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Pin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Note } from '@/shared/types/note.types';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { getProjectLabel } from '@/shared/constants/projects';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  showProjectLabel?: boolean;
}

function formatNoteDate(date: Date): string {
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

function getContentPreview(content: string): string {
  try {
    const blocks = JSON.parse(content);
    if (!Array.isArray(blocks) || blocks.length === 0) return '';
    const texts: string[] = [];
    for (const block of blocks) {
      if (block.content && Array.isArray(block.content)) {
        for (const item of block.content) {
          if (item.type === 'text' && item.text) {
            texts.push(item.text);
          }
        }
      }
      if (texts.join('').length > 80) break;
    }
    return texts.join('').slice(0, 60);
  } catch {
    return '';
  }
}

export const NoteCard = ({ note, isSelected, onSelect, onTogglePin, onDelete, showProjectLabel }: NoteCardProps) => {
  const preview = getContentPreview(note.content);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={onSelect}
      className={cn(
        'group relative cursor-pointer rounded-lg border p-3 transition-all duration-150',
        'border-l-[3px]',
        isSelected
          ? 'border-[var(--color-brand)] border-l-[var(--color-brand)] bg-[var(--color-note-card-active)] shadow-sm'
          : note.pinned
          ? 'border-[var(--color-note-card-border)] border-l-[var(--color-brand)] bg-[var(--color-note-card-bg)] hover:bg-[var(--color-note-card-hover)]'
          : 'border-[var(--color-note-card-border)] border-l-transparent bg-[var(--color-note-card-bg)] hover:bg-[var(--color-note-card-hover)] hover:border-l-[var(--color-border)]'
      )}
    >
      {/* Delete button — top-right, appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete note"
        className="absolute right-2 top-2 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
      >
        <X className="h-3.5 w-3.5 text-[var(--color-text-tertiary)] hover:text-red-600" />
      </button>

      {/* Title */}
      <div className="mb-1 pr-6 flex items-start justify-between gap-1">
        <h3
          className={cn(
            'text-sm font-semibold leading-tight line-clamp-1 flex-1',
            isSelected ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-primary)]'
          )}
        >
          {note.title || 'Untitled Note'}
        </h3>
        {showProjectLabel && (
          <span className="shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)] leading-none">
            {getProjectLabel(note.projectId)}
          </span>
        )}
      </div>

      {/* Content preview */}
      <p className="mb-2 text-[12px] leading-snug text-[var(--color-text-tertiary)] line-clamp-2 min-h-[1rem]">
        {preview || <span className="italic">Empty note</span>}
      </p>

      {/* Bottom row: tags + timestamp + pin */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden">
          {note.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 2 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
              +{note.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[var(--color-text-tertiary)]">
            {formatNoteDate(note.updatedAt)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            className={cn(
              'rounded p-0.5 transition-colors hover:bg-[var(--color-sidebar-hover)]',
              note.pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <Pin
              className={cn(
                'h-3 w-3',
                note.pinned
                  ? 'text-[var(--color-brand)] fill-[var(--color-brand)]'
                  : 'text-[var(--color-text-tertiary)]'
              )}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
