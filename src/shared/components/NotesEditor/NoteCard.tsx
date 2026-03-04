import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Pin, PinOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Note } from '@/shared/types/note.types';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
}

function formatNoteDate(date: Date): string {
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export const NoteCard = ({ note, isSelected, onSelect, onTogglePin }: NoteCardProps) => {
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
        isSelected
          ? 'border-[var(--color-brand)] bg-[var(--color-note-card-active)] shadow-sm'
          : 'border-[var(--color-note-card-border)] bg-[var(--color-note-card-bg)] hover:bg-[var(--color-note-card-hover)] hover:border-[var(--color-border)]'
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3
          className={cn(
            'text-sm font-semibold leading-tight line-clamp-1 flex-1',
            isSelected ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-primary)]'
          )}
        >
          {note.title || 'Untitled Note'}
        </h3>

        {/* Pin button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          className={cn(
            'shrink-0 rounded p-0.5 transition-colors opacity-0 group-hover:opacity-100',
            note.pinned && 'opacity-100',
            'hover:bg-[var(--color-sidebar-hover)]'
          )}
        >
          {note.pinned ? (
            <Pin className="h-3.5 w-3.5 text-[var(--color-brand)]" />
          ) : (
            <PinOff className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
          )}
        </button>
      </div>

      {/* Timestamp */}
      <p className="text-[11px] text-[var(--color-text-tertiary)] mb-2">
        {formatNoteDate(note.updatedAt)}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};
