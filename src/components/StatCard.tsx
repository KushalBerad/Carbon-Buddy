import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
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
  // Glow definitions matching Tailwind palettes
  const glowStyles: Record<string, string> = {
    emerald: 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/5',
    blue: 'bg-sky-500/10 dark:bg-sky-500/5 border-sky-500/10 dark:border-sky-500/5',
    amber: 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/10 dark:border-amber-500/5',
    indigo: 'bg-indigo-500/10 dark:bg-indigo-500/5 border-indigo-500/10 dark:border-indigo-500/5',
  };

  const selectedGlow = glowStyles[glowColor] || glowStyles.emerald;

  const trendStyles = {
    positive: {
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
      icon: <ArrowUp className="w-3 h-3" />,
    },
    negative: {
      bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400',
      icon: <ArrowDown className="w-3 h-3" />,
    },
    neutral: {
      bg: 'bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300',
      icon: <Minus className="w-3 h-3" />,
    },
  };

  const trend = trendStyles[changeType];

  return (
    <Card id={id} interactive outlined glowOnHover className="overflow-hidden flex flex-col justify-between min-h-[145px]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider font-sans">
            {title}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-50 font-mono">
              <AnimatedCounter value={value} decimals={value % 1 === 0 ? 0 : 1} />
            </span>
            {unit && (
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300 font-sans">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className={`p-2.5 rounded-xl border ${selectedGlow} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      {/* Trend Row */}
      {changeValue !== undefined && (
        <div className="flex items-center gap-2 mt-4 text-xs font-sans">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold ${trend.bg}`}>
            {trend.icon}
            <span>{Math.abs(changeValue)}%</span>
          </span>
          {changeLabel && (
            <span className="text-zinc-500 dark:text-zinc-300 truncate font-light">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
