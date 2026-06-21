import {
  ArrowRight,
  DollarSign,
  Flame,
  Hourglass,
  Leaf,
  Sparkles,
  Trophy,
  UtensilsCrossed
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

export const DashboardPage = React.memo(function DashboardPage({ 
  profile: propProfile, 
  progress: propProgress, 
  recentOffsets: propRecentOffsets, 
  onNavigate: propOnNavigate 
}: DashboardPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeSetCurrentView = useUserStore((s) => s.setCurrentView);
  const habits = useHabitStore((s) => s.habits);

  const profile = propProfile || storeProfile;
  const onNavigate = propOnNavigate || storeSetCurrentView;

  const progress = useMemo(() => {
    if (propProgress !== undefined) return propProgress;
    const totalCompleted = habits.filter(h => h.checked).length;
    return habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
  }, [propProgress, habits]);

  const recentOffsets = useMemo(() => {
    if (propRecentOffsets) return propRecentOffsets;
    const offsets = { transport: 0, food: 0, energy: 0, waste: 0, water: 0 };
    habits.filter(h => h.checked).forEach(h => {
      offsets[h.category] += h.offset;
    });
    return offsets;
  }, [propRecentOffsets, habits]);

  if (!profile) return null;

  // Simple category totals mapping
  const totalOffset = Object.values(recentOffsets).reduce((a, b) => (a as number) + (b as number), 0) as number;


  return (
    <div className="space-y-8 font-sans">
      {/* 1. Welcomer Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950 text-white relative overflow-hidden border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-44 h-44 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider font-mono border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400/10" /> Level {profile.level} Eco Pioneer
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm font-light max-w-xl">
              Your carbon-conscious actions are paying off. You have achieved <strong className="text-emerald-400 font-medium font-mono">{(profile.points / 100).toFixed(0)} milestones</strong> since launching!
            </p>
          </div>

          {/* Quick Streak Widget */}
          <div className="flex items-center gap-4 bg-zinc-950/40 border border-zinc-850 p-4 rounded-2xl shrink-0">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/10">
              <Flame className="w-6 h-6 fill-orange-500/10" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">COMMUNITY STREAK</span>
              <p className="text-lg font-extrabold font-mono text-orange-400 leading-none">{profile.streak} DAYS STRONG</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Carbon Saved"
          value={profile.carbonSavedTotal}
          unit="g CO₂"
          changeValue={14.8}
          changeType="positive"
          changeLabel="vs standard baseline"
          glowColor="emerald"
          icon={<Leaf className="w-5 h-5 text-emerald-500" />}
        />

        <StatCard
          title="Money Saved"
          value={profile.moneySavedTotal}
          unit="USD"
          changeValue={9.2}
          changeType="positive"
          changeLabel="Saved toll & commute cost"
          glowColor="amber"
          icon={<DollarSign className="w-5 h-5 text-amber-500" />}
        />

        <Card className="p-5 flex items-center gap-6">
          <ProgressRing 
            percentage={progress} 
            size={85} 
            strokeWidth={8}
            subLabel="milestone"
          />
          <div className="space-y-1.5 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-505">Daily Score</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Log daily lifestyle habits to reach {Math.ceil(progress / 10) * 10}% carbon reduction for additional point rewards!
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Deep Breakdowns & Recommended Actions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown (2 columns width) */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 font-sans">Carbon Offsets by Lifestyle Sector</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">Real-time breakdown of grams of carbon offset today.</p>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
              +{totalOffset}g Total Today
            </span>
          </div>

          {/* Graphical Bars representation */}
          <div className="space-y-5">
            {[
              { label: 'Green Commuting (Transport)', value: recentOffsets.transport, max: 2000, color: 'bg-emerald-500' },
              { label: 'Plant-Based Eating (Food)', value: recentOffsets.food, max: 2000, color: 'bg-teal-500' },
              { label: 'Energy Management (Power)', value: recentOffsets.energy, max: 2000, color: 'bg-amber-500' },
              { label: 'Conservation Choices (Water & Waste)', value: recentOffsets.water + recentOffsets.waste, max: 2000, color: 'bg-sky-500' },
            ].map((item, index) => {
              const pct = Math.min(100, Math.max(5, (item.value / item.max) * 100));
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-zinc-650 dark:text-zinc-300">
                    <span>{item.label}</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-250 font-bold">{item.value}g CO₂</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Launch Cards */}
        <Card className="p-6 flex flex-col justify-between border-l-4 border-l-emerald-500/80">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-zinc-805 dark:text-zinc-150 font-sans">Extend Commuter Streak</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                Unlock rare achievements like "Eco Commuter" by cycling or walking instead of ride-sharing!
              </p>
            </div>
          </div>

          <Button
            variant="accent"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('habits')}
            className="mt-6"
            aria-label="Navigate to habit logging page"
          >
            Log Eco Habits
          </Button>
		</Card>

      </div>

      {/* Earth Bloom Micro Terrarium */}
      <Card className="p-6 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0 select-none">
            <Leaf className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 font-sans flex items-center gap-1.5">
              <span>Earth Bloom Micro Terrarium</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold animate-pulse">ACTIVE FEED</span>
            </h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-300 font-light leading-relaxed max-w-2xl">
              Your points balance of <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-black">{profile.points} XP</strong> is feeding a blooming virtual flora! Nurture it with water, upgrade your companion species, and watch it grow carbon-eating flowers.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('bloom')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          aria-label="Check planter progress"
          className="bg-emerald-650 hover:bg-emerald-700 text-white shrink-0 font-bold border border-emerald-500/10 shadow-sm"
        >
          Check Planter Progress
        </Button>
      </Card>

      {/* 4. Instant Action Slider / Quick Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Meal suggest cross link */}
        <Card className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center shrink-0 text-teal-600">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-505">Suggested Eco Meals</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-light leading-relaxed">
              Explore dynamic green recipes holding lower carbon footprints. Replace a high-intensity beef burger with a custom alternative today to earn +40 points immediately.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('meals')}
              className="px-0 py-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs hover:bg-transparent"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              aria-label="Navigate to meal suggestions"
            >
              Explore Meal Alternatives
            </Button>
          </div>
        </Card>

        {/* Reflection cross link */}
        <Card className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0 text-indigo-500">
            <Hourglass className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-505">Weekly Lifestyle Reflection</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-light leading-relaxed">
              Review parameters in structured weekly retrospectives. Generate AI logs analyzing your metrics against regional grids.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('reflection')}
              className="px-0 py-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs hover:bg-transparent"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              aria-label="Navigate to reflection page"
            >
              Examine Progress Reports
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
});

