import { Bike, Check, Droplet, Trash2, Utensils, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { HabitToggleProps } from '../types';
import { Card } from './Card';

type HabitCategory = 'transport' | 'food' | 'energy' | 'waste' | 'water';

interface CategoryConfig {
  icon: React.ReactNode;
  bg: string;
  outline: string;
}

const CATEGORY_CONFIG: Record<HabitCategory, CategoryConfig> = {
  transport: {
    icon: <Bike className="w-5 h-5 text-sky-600 dark:text-sky-300" />,
    bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/30',
    outline: 'focus:ring-sky-500/30',
  },
  food: {
    icon: <Utensils className="w-5 h-5 text-amber-600 dark:text-amber-300" />,
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',
    outline: 'focus:ring-amber-500/30',
  },
  energy: {
    icon: <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',
    outline: 'focus:ring-emerald-500/30',
  },
  waste: {
    icon: <Trash2 className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />,
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30',
    outline: 'focus:ring-indigo-500/30',
  },
  water: {
    icon: <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-300" />,
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',
    outline: 'focus:ring-blue-500/30',
  },
};

export function HabitToggle({
  id,
  label,
  carbonOffsetGrams,
  moneySaved = 0,
  checked,
  onChange,
  category = 'energy',
}: HabitToggleProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <Card
      id={id}
      outlined
      className={`p-4.5 border-l-4 transition-all duration-300 ${
        checked
          ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10 dark:border-zinc-800'
          : 'border-l-zinc-300 dark:border-l-zinc-700 bg-white dark:bg-zinc-900'
      } relative overflow-hidden`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-xl border ${config.bg} flex items-center justify-center shrink-0`}
          >
            {config.icon}
          </div>

          <div className="space-y-1">
            <span
              className={`text-sm font-semibold tracking-wide transition-all ${
                checked
                  ? 'text-zinc-500 dark:text-zinc-300 line-through'
                  : 'text-zinc-700 dark:text-zinc-200'
              }`}
            >
              {label}
            </span>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md font-mono">
                -{carbonOffsetGrams}g CO₂
              </span>

              {moneySaved > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md font-mono">
                  +${moneySaved.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange(!checked)}
          aria-label={checked ? 'Mark habit as incomplete' : 'Mark habit as complete'}
          className={`relative w-8 h-8 rounded-xl border outline-none transition-all flex items-center justify-center cursor-pointer ${
            checked
              ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-450 shadow-sm shadow-emerald-500/25'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-650 bg-transparent text-transparent'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {checked && (
              <motion.div
                initial={{ scale: 0.3, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check className="w-5 h-5 stroke-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-emerald-500 rounded-2xl pointer-events-none -z-10"
          />
        )}
      </AnimatePresence>
    </Card>
  );
}