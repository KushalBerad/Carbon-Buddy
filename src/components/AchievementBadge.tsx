import {
  Award,
  Bike,
  Compass,
  Flame,
  Leaf,
  Lock,
  ShieldCheck,
  ShoppingBag,
  TrendingDown,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { AchievementBadgeProps } from '../types';
import { Card } from './Card';

export function AchievementBadge({
  id,
  title,
  description,
  unlockedAt,
  iconName,
  points,
  rare = false,
}: AchievementBadgeProps) {
  const isUnlocked = !!unlockedAt;

  // Resolve Lucide icons by name safely
  const iconMap: Record<string, React.ReactNode> = {
    flame: <Flame className="w-6 h-6 text-orange-500" />,
    leaf: <Leaf className="w-6 h-6 text-emerald-500" />,
    bike: <Bike className="w-6 h-6 text-sky-500" />,
    shield: <ShieldCheck className="w-6 h-6 text-teal-500" />,
    money: <TrendingDown className="w-6 h-6 text-amber-500" />,
    shopping: <ShoppingBag className="w-6 h-6 text-rose-500" />,
    compass: <Compass className="w-6 h-6 text-violet-500" />,
    zap: <Zap className="w-6 h-6 text-yellow-500" />,
  };

  const selectedIcon = iconMap[iconName] || <Award className="w-6 h-6 text-emerald-500" />;

  return (
    <Card
      id={id}
      interactive={isUnlocked}
      outlined
      className={`relative overflow-hidden p-5 flex flex-col items-center justify-between text-center min-h-[220px] transition-all duration-350 ${
        isUnlocked
          ? rare
            ? 'bg-gradient-to-br from-indigo-50/50 to-emerald-50/20 dark:from-indigo-950/20 dark:to-emerald-950/10 border-indigo-200 dark:border-indigo-800'
            : 'bg-white dark:bg-zinc-900'
          : 'bg-zinc-50/40 dark:bg-zinc-900/40 opacity-70 border-zinc-200 dark:border-zinc-800'
      }`}
    >
      {/* Rare tag */}
      {rare && isUnlocked && (
        <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          Rare
        </span>
      )}

      {/* Badge Ring */}
      <div className="relative mt-2">
        <motion.div
          animate={
            isUnlocked
              ? {
                  boxShadow: rare
                    ? ['0 0 0px rgba(139, 92, 246, 0)', '0 0 15px rgba(139, 92, 246, 0.45)', '0 0 0px rgba(139, 92, 246, 0)']
                    : ['0 0 0px rgba(16, 185, 129, 0)', '0 0 10px rgba(16, 185, 129, 0.3)', '0 0 0px rgba(16, 185, 129, 0)'],
                }
              : {}
          }
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
            isUnlocked
              ? rare
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-805 text-indigo-600'
                : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/30'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-705 text-zinc-500'
          }`}
        >
          {isUnlocked ? selectedIcon : <Lock className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />}
        </motion.div>

        {isUnlocked && (
          <span className="absolute -bottom-1 -right-1 text-[10px] font-bold px-1.2 py-0.2 rounded-md bg-emerald-500 text-white shadow-xs font-mono">
            +{points}p
          </span>
        )}
      </div>

      {/* Info Block */}
      <div className="space-y-1 mt-3">
        <h4
          className={`text-sm font-semibold tracking-wide ${
            isUnlocked ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-455 dark:text-zinc-300 font-normal'
          }`}
        >
          {title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-300 leading-relaxed font-light line-clamp-2 px-1">
          {description}
        </p>
      </div>

      {/* Footer unlocked date */}
      <div className="mt-4 text-[10px] text-zinc-500 dark:text-zinc-300 font-mono">
        {isUnlocked && unlockedAt ? (
          <span className="opacity-80">Unlocked {unlockedAt}</span>
        ) : (
          <span className="font-sans flex items-center gap-1 justify-center italic text-zinc-500/70 font-light">
            Locked
          </span>
        )}
      </div>
    </Card>
  );
}
