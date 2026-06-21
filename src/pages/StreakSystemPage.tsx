import {
  Flame,
  HelpCircle,
  Lock,
  Star,
  Trophy,
} from 'lucide-react';

import React from 'react';

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

export const StreakSystemPage =
  React.memo(function StreakSystemPage({
    profile: propProfile,
    achievements: propAchievements,
  }: StreakSystemPageProps) {
    const storeProfile =
      useUserStore(
        (s) => s.profile
      );

    const profile =
      propProfile ||
      storeProfile;

    if (!profile) {
      return null;
    }

    const achievements =
      React.useMemo(() => {
        if (
          propAchievements
        ) {
          return propAchievements;
        }

        return [
          {
            id: 'ach-1',
            title:
              'Seed Sower',
            description:
              'Complete onboarding setup and unlock the ecosystem.',
            points: 100,
            unlocked: true,
            iconName:
              'sprout',
          },
          {
            id: 'ach-2',
            title:
              'Carbon Zero Commuter',
            description:
              'Earn over 250g carbon savings using sustainable transport.',
            points: 150,
            unlocked:
              profile.carbonSavedTotal >=
              250,
            iconName:
              'bike',
          },
          {
            id: 'ach-3',
            title:
              'Green Streak Master',
            description:
              'Maintain a streak of 3 days or more.',
            points: 200,
            unlocked:
              profile.streak >=
              3,
            iconName:
              'flame',
          },
          {
            id: 'ach-4',
            title:
              'Earth Bloom Custodian',
            description:
              'Reach 300 XP and strengthen your virtual ecosystem.',
            points: 250,
            unlocked:
              profile.points >=
              300,
            iconName:
              'flower',
          },
        ];
      }, [
        propAchievements,
        profile.carbonSavedTotal,
        profile.streak,
        profile.points,
      ]);

    const multiplier =
      React.useMemo(() => {
        if (
          profile.streak >=
          7
        ) {
          return 1.5;
        }

        if (
          profile.streak >=
          3
        ) {
          return 1.2;
        }

        return 1.0;
      }, [
        profile.streak,
      ]);

    const xpRemaining =
      React.useMemo(() => {
        if (
          profile.points %
          300 ===
          0
        ) {
          return 0;
        }

        return (
          300 -
          (profile.points %
            300)
        );
      }, [
        profile.points,
      ]);

    return (
      <div className="space-y-8 font-sans">

        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-zinc-200/50 pb-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Green Achievements &
              Streak Multipliers
            </h1>

            <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
              Maintain daily habits,
              unlock badges,
              and earn reward multipliers.
            </p>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Multiplier */}

          <Card className="relative overflow-hidden border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-500/10 to-transparent p-6">

            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">

                <Flame className="h-6 w-6 animate-pulse fill-orange-500/10" />
              </div>

              <div>

                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-orange-500">
                  POINT MULTIPLIER
                </span>

                <p className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  {multiplier.toFixed(
                    1
                  )}
                  x
                </p>

                <p className="mt-1 text-[10px] font-light text-zinc-500 dark:text-zinc-300">
                  Based on your{' '}
                  {
                    profile.streak
                  }
                  -day streak
                </p>
              </div>
            </div>
          </Card>

          {/* Level */}

          <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">

            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">

                <Trophy className="h-6 w-6" />
              </div>

              <div>

                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  CURRENT LEVEL
                </span>

                <p className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Level{' '}
                  {
                    profile.level
                  }
                </p>

                <p className="mt-1 text-[10px] font-light text-zinc-500 dark:text-zinc-300">
                  {
                    profile.points
                  }{' '}
                  XP accumulated
                </p>
              </div>
            </div>
          </Card>
          {/* Next Tier */}

          <Card className="relative overflow-hidden border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-500/5 to-transparent p-6">

            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">

                <Star className="h-6 w-6 fill-indigo-500/10" />
              </div>

              <div>

                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  NEXT UPGRADE
                </span>

                <p className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  +{xpRemaining} XP
                </p>

                <p className="mt-1 text-[10px] font-light text-zinc-500 dark:text-zinc-300">
                  XP required for next tier
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievement Grid */}

        <div className="space-y-4">

          <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
            Eco Badge Collection
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {achievements.map(
              (badge) => (
                <div
                  key={
                    badge.id
                  }
                  className="relative"
                >
                  <AchievementBadge
                    title={
                      badge.title
                    }
                    description={
                      badge.description
                    }
                    points={
                      badge.points
                    }
                    unlockedAt={
                      badge.unlocked
                        ? 'Unlocked'
                        : undefined
                    }
                    iconName={
                      badge.iconName
                    }
                  />

                  {!badge.unlocked && (
                    <div className="absolute right-3 top-3 rounded-lg border border-zinc-200 bg-zinc-100 p-1.5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">

                      <Lock className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Info Section */}

        <Card className="flex items-start gap-3 border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/25">

          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

          <div className="space-y-1">

            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              How do streaks work?
            </h4>

            <p className="text-[11px] font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
              Logging habits daily
              increases your streak.
              At 3 days you unlock
              a 1.2x multiplier.
              At 7 days you unlock
              a 1.5x multiplier.
              Missing activity for
              a full cycle resets
              streak progress.
            </p>
          </div>
        </Card>

      </div>
    );
  });

export default StreakSystemPage;