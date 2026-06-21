import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId } from 'react';
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
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 overflow-y-auto font-sans">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
              onClick={onClose}
              className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descriptionId : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-100 bg-white p-6 text-left shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                  {title && (
                    <h3
                      id={titleId}
                      className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                    >
                      {title}
                    </h3>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className="text-xs font-light text-zinc-500 dark:text-zinc-300"
                    >
                      {description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors outline-none hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-2 text-sm text-zinc-700 dark:text-zinc-300">
                {children}
              </div>

              {footer && (
                <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
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