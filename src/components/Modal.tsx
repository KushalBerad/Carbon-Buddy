import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { ModalProps } from '../types';

export function Modal({
  id,
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  // Bind Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 overflow-y-auto font-sans">
          {/* Backdrop Overlay */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 text-left shadow-2xl transition-all z-10"
            >
              {/* Header block */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  {title && (
                    <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light">
                      {description}
                    </p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-805 text-zinc-500 dark:text-zinc-300 hover:text-zinc-755 transition-colors cursor-pointer outline-none"
                  aria-label="Close form Modal"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Main Dialog contents */}
              <div className="text-sm text-zinc-650 dark:text-zinc-300 py-2">
                {children}
              </div>

              {/* Footer details */}
              {footer && (
                <div className="mt-6 flex justify-end gap-3 border-t border-zinc-150/45 dark:border-zinc-800/80 pt-4.5">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
