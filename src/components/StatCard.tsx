import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useMemo } from 'react';
import { StatCardProps } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { Card } from './Card';

export function StatCard({
  id,
  title,
  value,
  unit = '',
  changeValue,
  changeType = 'neutral',
  changeLabel = '',
  icon,
  glowColor = 'emerald',
}: StatCardProps) {
  const glowStyles: Record<string, string> = {
    emerald:
      'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/5',
    blue:
      'bg-sky-500/10 dark:bg-sky-500/5 border-sky-500/10 dark:border-sky-500/5',
    amber:
      'bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/10 dark:border-amber-500/5',
    indigo:
      'bg-indigo-500/10 dark:bg-indigo-500/5 border-indigo-500/10 dark:border-indigo-500/5',
  };

  const trendStyles = {
    positive: {
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
      icon: <ArrowUp className="w-3 h-3" />,
    },
    negative: {
      bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
      icon: <ArrowDown className="w-3 h-3" />,
    },
    neutral: {
      bg: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
      icon: <Minus className="w-3 h-3" />,
    },
  };

  const selectedGlow = useMemo(
    () => glowStyles[glowColor] ?? glowStyles.emerald,
    [glowColor],
  );

  const trend = useMemo(
    () => trendStyles[changeType],
    [changeType],
  );

  const decimals = Number.isInteger(value) ? 0 : 1;

  return (
    <Card
      id={id}
      interactive
      outlined
      glowOnHover
      className="flex min-h-[145px] flex-col justify-between overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
            {title}
          </span>

          <div className="mt-1 flex items-baseline gap-1">
            <span
              aria-label={`${title} value`}
              className="font-mono text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-50"
            >
              <AnimatedCounter
                value={value}
                decimals={decimals}
              />
            </span>

            {unit && (
              <span className="font-sans text-sm font-medium text-zinc-500 dark:text-zinc-300">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`flex shrink-0 items-center justify-center rounded-xl border p-2.5 ${selectedGlow}`}
          >
            {icon}
          </div>
        )}
      </div>

      {changeValue !== undefined && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold ${trend.bg}`}
          >
            {trend.icon}
            <span>{Math.abs(changeValue)}%</span>
          </span>

          {changeLabel && (
            <span className="truncate font-light text-zinc-500 dark:text-zinc-300">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}