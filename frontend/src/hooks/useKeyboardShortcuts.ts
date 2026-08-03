import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

export function useKeyboardShortcuts({ onUndo, onRedo, onDownload, onCopy }: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard clause: Don't trigger if typing in an input
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            onRedo();
          } else {
            onUndo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          onRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          onDownload();
        } else if (e.key === 'c') {
          const selection = window.getSelection();
          if (selection && selection.toString().length === 0) {
            e.preventDefault();
            onCopy();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDownload, onCopy]);
}
