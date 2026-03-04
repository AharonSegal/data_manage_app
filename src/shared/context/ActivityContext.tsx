/**
 * ActivityContext.tsx — activity log state backed by Firestore.
 *
 * Maintains a real-time onSnapshot listener on "activityLogs" (newest first,
 * capped at 100 entries). `logActivity()` writes a new entry with serverTimestamp.
 * Consumed by ActivityLogPage and any feature that wants to record an event.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { ActivityEntry, ActivityEntryFirestore, ActivityType, ActivityStatus } from '@/shared/types/activity.types';

const ACTIVITY_COL = 'activityLogs';

interface ActivityContextValue {
  entries: ActivityEntry[];
  loading: boolean;
  logActivity: (
    type: ActivityType,
    description: string,
    options?: { projectId?: string; status?: ActivityStatus; metadata?: Record<string, unknown> }
  ) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, ACTIVITY_COL),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ActivityEntry[] = snapshot.docs.map((d) => {
        const data = d.data() as ActivityEntryFirestore;
        return {
          id: d.id,
          timestamp: (data.timestamp as Timestamp)?.toDate?.() ?? new Date(),
          type: data.type,
          description: data.description,
          projectId: data.projectId,
          status: data.status ?? 'success',
          metadata: data.metadata,
        };
      });
      setEntries(fetched);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logActivity = async (
    type: ActivityType,
    description: string,
    options: { projectId?: string; status?: ActivityStatus; metadata?: Record<string, unknown> } = {}
  ) => {
    const data: Omit<ActivityEntryFirestore, 'timestamp'> & { timestamp: ReturnType<typeof serverTimestamp> } = {
      type,
      description,
      status: options.status ?? 'success',
      timestamp: serverTimestamp(),
      ...(options.projectId !== undefined && { projectId: options.projectId }),
      ...(options.metadata !== undefined && { metadata: options.metadata }),
    };
    await addDoc(collection(db, ACTIVITY_COL), data);
  };

  return (
    <ActivityContext.Provider value={{ entries, loading, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
};
