import React from 'react';

interface LoadingSkeletonProps {
  id?: string;
  variant?: 'line' | 'circle' | 'card' | 'stat';
  className?: string;
  count?: number;
}

export function LoadingSkeleton({
  id,
  variant = 'line',
  className = '',
  count = 1,
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-zinc-200 dark:bg-zinc-805 animate-pulse rounded-full';

  const selectVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'w-12 h-12 rounded-full shrink-0';
      case 'card':
        return 'w-full h-44 rounded-2xl';
      case 'stat':
        return 'w-full h-[145px] rounded-2xl';
      case 'line':
      default:
        return 'w-full h-4.5';
    }
  };

  const currentVariantClass = selectVariantClasses();

  return (
    <div id={id} className="w-full flex flex-col gap-3 font-sans">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-full">
          {variant === 'stat' ? (
            <div className="w-full h-[145px] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 flex flex-col justify-between animate-pulse">
              <div className="flex items-start justify-between w-full">
                <div className="space-y-4 w-2/3">
                  <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-7 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-3.5 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          ) : variant === 'card' ? (
            <div className="w-full h-44 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900 flex flex-col justify-between animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2.5 flex-1">
                  <div className="h-4.5 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-2.5 mt-4">
                <div className="h-6 w-16 bg-zinc-250 dark:bg-zinc-800 rounded-md" />
                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              </div>
            </div>
          ) : (
            <div className={`${baseClasses} ${currentVariantClass} ${className}`} />
          )}
        </div>
      ))}
    </div>
  );
}
