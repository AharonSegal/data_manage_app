/**
 * activity.types.ts — TypeScript types for the activity log.
 *
 * ActivityEntry is the runtime shape (timestamps as Date).
 * ActivityEntryFirestore is the Firestore shape (timestamps as Timestamp).
 */

import type { Timestamp } from 'firebase/firestore';

export type ActivityType = 'email' | 'whatsapp' | 'data_import' | 'note' | 'manual' | 'system';
export type ActivityStatus = 'success' | 'failed' | 'pending';

export interface ActivityEntry {
  id: string;
  timestamp: Date;
  type: ActivityType;
  description: string;
  projectId?: string;
  status: ActivityStatus;
  metadata?: Record<string, unknown>;
}

export interface ActivityEntryFirestore extends Omit<ActivityEntry, 'id' | 'timestamp'> {
  timestamp: Timestamp;
}
