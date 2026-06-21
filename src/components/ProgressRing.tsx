import { motion } from 'motion/react';
import { ProgressRingProps } from '../types';

export function ProgressRing({
  id,
  percentage,
  size = 120,
  strokeWidth = 10,
  colorClass = 'text-emerald-500',
  backgroundColorClass = 'text-zinc-100 dark:text-zinc-800',
  label,
  subLabel,
}: ProgressRingProps) {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (normalizedPercentage / 100) * circumference;

  const displayLabel =
    label !== undefined ? label : `${Math.round(normalizedPercentage)}%`;

  return (
    <div
      id={id}
      className="relative flex flex-col items-center justify-center font-sans"
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="progressbar"
        aria-label="Carbon progress indicator"
      >
        <svg
          className="h-full w-full -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Progress ring showing ${Math.round(normalizedPercentage)}% completion`}
        >
          <circle
            className={backgroundColorClass}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          <motion.circle
            className={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progressOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
          <span className="font-mono text-xl font-bold text-zinc-800 dark:text-zinc-100">
            {displayLabel}
          </span>

          {subLabel && (
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
              {subLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}