/**
 * ActivityLogPage.tsx — chronological log of all system actions and events.
 *
 * Reads from ActivityContext (live Firestore listener, newest first).
 * Renders a vertical timeline: each entry has a type icon, description,
 * status badge, optional project tag, and a relative timestamp.
 */

import { formatDistanceToNow } from 'date-fns';
import {
  Mail,
  MessageCircle,
  Upload,
  NotebookPen,
  User,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/shared/components/Layout/PageHeader';
import { useActivity } from '@/shared/context/ActivityContext';
import type { ActivityType, ActivityStatus } from '@/shared/types/activity.types';

// Icons by activity type
const TYPE_ICON: Record<ActivityType, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  data_import: <Upload className="h-4 w-4" />,
  note: <NotebookPen className="h-4 w-4" />,
  manual: <User className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
};

const TYPE_COLOR: Record<ActivityType, string> = {
  email: 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]',
  whatsapp: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  data_import: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  note: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  manual: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]',
  system: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]',
};

const STATUS_BADGE: Record<ActivityStatus, React.ReactNode> = {
  success: (
    <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-success)]">
      <CheckCircle2 className="h-3 w-3" /> Success
    </span>
  ),
  failed: (
    <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-error)]">
      <XCircle className="h-3 w-3" /> Failed
    </span>
  ),
  pending: (
    <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-warning)]">
      <Clock className="h-3 w-3" /> Pending
    </span>
  ),
};

const ActivityLogPage = () => {
  const { entries, loading } = useActivity();

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Activity Log"
        subtitle="History of all automated actions and system events"
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center mb-1">
            <Clock className="h-6 w-6 text-[var(--color-text-tertiary)]" />
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">No activity yet</p>
          <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs">
            Activity will appear here as emails are sent, data is imported, and actions are triggered.
          </p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <ol className="relative border-l border-[var(--color-border)] ml-4 space-y-0">
          {entries.map((entry) => (
            <li key={entry.id} className="relative pl-8 pb-7 last:pb-0">
              {/* Timeline dot with icon */}
              <div
                className={`absolute -left-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] ${TYPE_COLOR[entry.type]}`}
              >
                {TYPE_ICON[entry.type]}
              </div>

              {/* Card */}
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
                      {entry.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {STATUS_BADGE[entry.status]}
                      {entry.projectId && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]">
                          {entry.projectId}
                        </span>
                      )}
                    </div>
                  </div>
                  <time className="shrink-0 text-[11px] text-[var(--color-text-tertiary)] pt-0.5">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </time>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ActivityLogPage;
