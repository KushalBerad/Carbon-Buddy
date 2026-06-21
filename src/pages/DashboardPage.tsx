import {
  ArrowRight,
  DollarSign,
  Flame,
  Hourglass,
  Leaf,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { StatCard } from '../components/StatCard';
import { useHabitStore } from '../store/habitStore';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface DashboardPageProps {
  profile?: UserProfile;
  progress?: number;
  recentOffsets?: {
    transport: number;
    food: number;
    energy: number;
    waste: number;
    water: number;
  };
  onNavigate?: (tabId: string) => void;
}

type OffsetMap = {
  transport: number;
  food: number;
  energy: number;
  waste: number;
  water: number;
};

export const DashboardPage = React.memo(function DashboardPage({
  profile: propProfile,
  progress: propProgress,
  recentOffsets: propRecentOffsets,
  onNavigate: propOnNavigate,
}: DashboardPageProps) {
  const storeProfile = useUserStore((state) => state.profile);
  const setCurrentView = useUserStore((state) => state.setCurrentView);
  const habits = useHabitStore((state) => state.habits);

  const profile = propProfile ?? storeProfile;
  const onNavigate = propOnNavigate ?? setCurrentView;

  const progress = useMemo(() => {
    if (typeof propProgress === 'number') return propProgress;

    const completedHabits = habits.filter((habit) => habit.checked).length;

    return habits.length > 0
      ? Math.round((completedHabits / habits.length) * 100)
      : 0;
  }, [propProgress, habits]);

  const recentOffsets = useMemo<OffsetMap>(() => {
    if (propRecentOffsets) return propRecentOffsets;

    return habits.reduce<OffsetMap>(
      (accumulator, habit) => {
        if (habit.checked) {
          accumulator[habit.category] += habit.offset;
        }

        return accumulator;
      },
      {
        transport: 0,
        food: 0,
        energy: 0,
        waste: 0,
        water: 0,
      }
    );
  }, [propRecentOffsets, habits]);

  const totalOffset = useMemo(() => {
    return Object.values(recentOffsets).reduce(
      (total, value) => total + value,
      0
    );
  }, [recentOffsets]);

  if (!profile) return null;

  const offsetBreakdown = [
    {
      label: 'Sustainable Transport',
      value: recentOffsets.transport,
      max: 2000,
      color: 'bg-emerald-500',
    },
    {
      label: 'Low Carbon Food Choices',
      value: recentOffsets.food,
      max: 2000,
      color: 'bg-teal-500',
    },
    {
      label: 'Energy Optimization',
      value: recentOffsets.energy,
      max: 2000,
      color: 'bg-amber-500',
    },
    {
      label: 'Water & Waste Reduction',
      value: recentOffsets.water + recentOffsets.waste,
      max: 2000,
      color: 'bg-sky-500',
    },
  ];

  return (
    <main
      role="main"
      className="space-y-8 font-sans"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-900 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-44 w-44 rounded-full bg-teal-500/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Level {profile.level} Sustainability Leader
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, {profile.name}
            </h1>

            <p className="max-w-xl text-xs font-light text-zinc-400 sm:text-sm">
              Your sustainability decisions continue reducing carbon emissions.
              You have earned{' '}
              <strong className="font-mono font-semibold text-emerald-400">
                {profile.points} impact points
              </strong>{' '}
              while building healthier environmental habits.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-950/40 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/10 text-orange-400">
              <Flame className="h-6 w-6" />
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Sustainability Streak
              </span>

              <p className="text-lg font-extrabold leading-none text-orange-400">
                {profile.streak} DAYS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Carbon Saved"
          value={profile.carbonSavedTotal}
          unit="g CO₂"
          changeValue={14.8}
          changeType="positive"
          changeLabel="Environmental reduction"
          glowColor="emerald"
          icon={<Leaf className="h-5 w-5 text-emerald-500" />}
        />

        <StatCard
          title="Money Saved"
          value={profile.moneySavedTotal}
          unit="USD"
          changeValue={9.2}
          changeType="positive"
          changeLabel="Daily sustainable savings"
          glowColor="amber"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
        />

        <Card className="flex items-center gap-6 p-5">
          <ProgressRing
            percentage={progress}
            size={85}
            strokeWidth={8}
            subLabel="progress"
          />

          <div className="flex-1 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
              Daily Completion Score
            </h3>

            <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
              Continue completing sustainability habits to maximize your daily
              environmental impact score.
            </p>
          </div>
        </Card>
      </section>

      {/* Carbon Analytics */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-6 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Carbon Impact Analytics
              </h2>

              <p className="mt-1 text-[11px] font-light text-zinc-500 dark:text-zinc-300">
                Real-time sustainability contribution breakdown.
              </p>
            </div>

            <span className="rounded-xl bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{totalOffset}g Today
            </span>
          </div>

          <div className="space-y-5">
            {offsetBreakdown.map((item) => {
              const percentage = Math.min(
                100,
                Math.max(5, (item.value / item.max) * 100)
              );

              return (
                <div
                  key={item.label}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <span>{item.label}</span>

                    <span className="font-mono font-bold">
                      {item.value}g CO₂
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="flex flex-col justify-between border-l-4 border-l-emerald-500/80 p-6">
          <div className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Trophy className="h-5 w-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Build Sustainability Streak
              </h3>

              <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Continue sustainable commuting, food selection, and energy
                reduction habits to unlock advanced environmental milestones.
              </p>
            </div>
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={() => onNavigate('habits')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            aria-label="Open daily habits tracker"
            title="Open daily habits tracker"
            className="mt-6"
          >
            Track Daily Habits
          </Button>
        </Card>
      </section>

      {/* Earth Bloom */}
      <section>
        <Card className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-emerald-500/10 bg-linear-to-r from-emerald-500/5 to-teal-500/5 p-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <Leaf className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Earth Bloom Ecosystem

                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600">
                  ACTIVE
                </span>
              </h3>

              <p className="max-w-2xl text-xs font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                Your sustainability actions directly contribute toward the
                virtual Earth Bloom ecosystem. Maintain responsible habits and
                continue building long-term environmental impact.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('bloom')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            aria-label="Open Earth Bloom system"
            title="Open Earth Bloom system"
            className="shrink-0"
          >
            View Earth Bloom
          </Button>
        </Card>
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <UtensilsCrossed className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
              Eco Food Alternatives
            </h4>

            <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
              Discover sustainable meal alternatives designed to lower carbon
              emissions while preserving nutritional value and reducing resource
              consumption.
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('meals')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              aria-label="Open meal alternatives"
              title="Open meal alternatives"
              className="px-0 py-1 text-xs font-semibold text-emerald-600 hover:bg-transparent dark:text-emerald-400"
            >
              Explore Meal Plans
            </Button>
          </div>
        </Card>

        <Card className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Hourglass className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
              Weekly Sustainability Reflection
            </h4>

            <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
              Generate AI-powered weekly sustainability reports and analyze your
              carbon-saving performance against long-term environmental goals.
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('reflection')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              aria-label="Open sustainability report"
              title="Open sustainability report"
              className="px-0 py-1 text-xs font-semibold text-emerald-600 hover:bg-transparent dark:text-emerald-400"
            >
              View Weekly Reports
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
});