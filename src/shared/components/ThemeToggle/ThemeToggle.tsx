import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-sm font-medium text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] transition-colors"
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Moon className="h-4 w-4 text-[var(--color-brand)]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <Sun className="h-4 w-4 text-[var(--color-warning)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};
