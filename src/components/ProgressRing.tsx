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
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div id={id} className="relative flex flex-col items-center justify-center font-sans">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            className={backgroundColorClass}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Active progress ring */}
          <motion.circle
            className={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center label block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {label !== undefined ? (
            <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">
              {label}
            </span>
          ) : (
            <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">
              {Math.round(clampedPercentage)}%
            </span>
          )}
          {subLabel && (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-medium uppercase tracking-wider mt-0.5">
              {subLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
