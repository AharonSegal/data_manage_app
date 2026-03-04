/**
 * useNoteKeyboardShortcut.ts — triggers note creation on the "N" key.
 *
 * Safe: ignores the keypress when focus is inside an input, textarea,
 * select, or any contentEditable element (e.g. the BlockNote editor).
 * Uses a ref for the callback so callers don't need useCallback.
 */

import { useEffect, useRef } from 'react';

export const useNoteKeyboardShortcut = (onCreate: () => void): void => {
  const onCreateRef = useRef(onCreate);
  onCreateRef.current = onCreate;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== 'n' && e.key !== 'N') return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) return;

      e.preventDefault();
      onCreateRef.current();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
};
