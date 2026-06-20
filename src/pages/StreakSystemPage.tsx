import { Flame, HelpCircle, Lock, Star, Trophy } from 'lucide-react';
import React, { useMemo } from 'react';
import { AchievementBadge } from '../components/AchievementBadge';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  iconName: string;
}

export interface StreakSystemPageProps {
  profile?: UserProfile;
  achievements?: Achievement[];
}

export const StreakSystemPage = React.memo(function StreakSystemPage({ profile: propProfile, achievements: propAchievements }: StreakSystemPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const profile = propProfile || storeProfile;

  const achievements = useMemo(() => {
    if (propAchievements) return propAchievements;
    if (!profile) return [];
    
    return [
      { id: 'ach-1', title: 'Seed Sower', description: 'Complete onboarding parameters and unlock the sandbox.', points: 100, unlocked: true, iconName: 'sprout' },
      { id: 'ach-2', title: 'Carbon Zero Commuter', description: 'Earn over 250 metric savings through green transit choices.', points: 150, unlocked: profile.carbonSavedTotal >= 250, iconName: 'bike' },
      { id: 'ach-3', title: 'Green Streak Master', description: 'Reach a continuous streak milestone of 3 or higher.', points: 200, unlocked: profile.streak >= 3, iconName: 'flame' },
      { id: 'ach-4', title: 'Earth Bloom Custodian', description: 'Amass 300 milestone points to bolster virtual flora.', points: 250, unlocked: profile.points >= 300, iconName: 'flower' },
    ];
  }, [propAchievements, profile]);

  if (!profile) return null;

  // Compute multiplier factors
  const multiplier = profile.streak >= 7 ? 1.5 : profile.streak >= 3 ? 1.2 : 1.0;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Green Achievements & Streak multipliers
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
            Maintain daily habits to trigger multipliers and unlock rare badges.
          </p>
        </div>
      </div>

      {/* Gamification multipliers scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Streak Multiplier Card */}
        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-transparent border-l-4 border-l-orange-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
              <Flame className="w-6 h-6 fill-orange-500/10 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest font-mono">POINT MULTIPLIER</span>
              <p className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">{multiplier.toFixed(1)}x</p>
              <p className="text-[10px] text-zinc-500/80 dark:text-zinc-300 font-light mt-1">Based on your {profile.streak}-day check-in streak</p>
            </div>
          </div>
        </Card>

        {/* Milestone Reward Box */}
        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent border-l-4 border-l-emerald-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest font-mono">TOTAL LEVEL</span>
              <p className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">Level {profile.level}</p>
              <p className="text-[10px] text-zinc-500/80 dark:text-zinc-300 font-light mt-1">{profile.points} XP total balance accumulated</p>
            </div>
          </div>
        </Card>

        {/* Next Tier Marker Card */}
        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-transparent border-l-4 border-l-indigo-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
              <Star className="w-6 h-6 fill-indigo-500/10" />
            </div>
            <div>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest font-mono">NEXT UPGRADE</span>
              <p className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">+{300 - (profile.points % 300)} XP</p>
              <p className="text-[10px] text-zinc-500/80 dark:text-zinc-300 font-light mt-1">Points needed to reach the next tier</p>
            </div>
          </div>
        </Card>

      </div>

      {/* Badges Grid Collection */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Eco-Badge Collection</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((badge) => (
            <div key={badge.id} className="relative group">
              <AchievementBadge
                title={badge.title}
                description={badge.description}
                points={badge.points}
                unlockedAt={badge.unlocked ? "Active" : undefined}
                iconName={badge.iconName}
              />
              
              {/* Optional Lock Indicator overlay */}
              {!badge.unlocked && (
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 text-zinc-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory Rules Block */}
      <Card className="p-5 flex items-start gap-3 bg-zinc-50 dark:bg-zinc-950/25 border-zinc-150/40 dark:border-zinc-850">
        <HelpCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">How do Green Streaks work?</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
            Every day you log multiple checklist actions, your streak grows. Reaching a 3-day streak unlocks a 1.2x points multiplier vector. Reaching a 7-day streak upgrades this factor to 1.5x points! Be careful: missing logs for a whole consecutive calendar cycle resets the streak.
          </p>
        </div>
      </Card>

    </div>
  );
});

