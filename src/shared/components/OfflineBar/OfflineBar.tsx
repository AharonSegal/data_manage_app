/**
 * OfflineBar.tsx — animated banner shown when the user is offline.
 *
 * Uses Framer Motion AnimatePresence to slide in/out smoothly.
 * Relies on useOnlineStatus to detect connectivity via browser events.
 */

import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';

export const OfflineBar = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline-bar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-warning)] text-[var(--color-text-inverted)] text-xs font-medium">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span>You're offline — changes will sync when reconnected</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
