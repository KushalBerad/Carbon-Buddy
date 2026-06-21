import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Flame,
  Leaf,
  Menu,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import { useMealStore } from '../store/mealStore';
import { useUserStore } from '../store/userStore';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  id?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  time: string;
  badge: string;
  badgeColor: string;
  actionView: string;
}

export function Navbar({ id }: NavbarProps) {
  const profile = useUserStore((state) => state.profile);
  const sidebarOpen = useUserStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUserStore((state) => state.setSidebarOpen);
  const setCurrentView = useUserStore((state) => state.setCurrentView);

  const meals = useMealStore((state) => state.meals);
  const habits = useHabitStore((state) => state.habits);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const userPoints = profile?.points ?? 0;
  const streakDays = profile?.streak ?? 0;
  const carbonSavedKg = ((profile?.carbonSavedTotal ?? 0) / 1000).toFixed(1);

  const currentLevel = profile?.level ?? 1;
  const pointsToNext = currentLevel * 250 - userPoints;

  const suggestedMeal = meals.find((meal) => !meal.adopted);

  const habitsRemaining =
    habits.length - habits.filter((habit) => habit.checked).length;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  const handleNotificationToggle = () => {
    setDropdownOpen((previous) => !previous);
    setHasUnread(false);
  };

  const handleNotificationNavigation = (view: string) => {
    setCurrentView(view);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const notifications = useMemo<NotificationItem[]>(() => {
    return [
      {
        id: 'carbon-progress',
        title: 'Carbon Reduction Progress',
        description: `You have reduced approximately ${carbonSavedKg} kg of carbon emissions through sustainable choices.`,
        icon: <Leaf className="w-4 h-4 text-emerald-500" />,
        time: 'Live',
        badge: 'Impact',
        badgeColor:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        actionView: 'dashboard',
      },
      {
        id: 'habit-tracker',
        title: 'Daily Sustainability Habits',
        description:
          habitsRemaining === 0
            ? 'All sustainable activities completed for today.'
            : `${habitsRemaining} sustainable habits still pending today.`,
        icon: <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
        time: 'Today',
        badge: habitsRemaining === 0 ? 'Complete' : `${habitsRemaining} Left`,
        badgeColor:
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        actionView: 'habits',
      },
      {
        id: 'meal-suggestion',
        title: 'Low Carbon Meal Recommendation',
        description: suggestedMeal
          ? `Switch to ${suggestedMeal.alternativeName} and reduce ${suggestedMeal.carbonOffsetGrams}g emissions.`
          : 'Explore AI-generated sustainable food alternatives.',
        icon: <Trophy className="w-4 h-4 text-teal-500" />,
        time: 'Nutrition',
        badge: 'Meal',
        badgeColor:
          'bg-teal-500/10 text-teal-600 dark:text-teal-400',
        actionView: 'meals',
      },
      {
        id: 'activity-days',
        title: 'Sustainability Activity Consistency',
        description:
          streakDays > 0
            ? `${streakDays} active sustainability tracking days recorded.`
            : 'Start tracking eco-friendly activities today.',
        icon: <Flame className="w-4 h-4 text-orange-500" />,
        time: 'Daily',
        badge: `${streakDays} Days`,
        badgeColor:
          'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        actionView: 'habits',
      },
      {
        id: 'progress-score',
        title: 'Environmental Progress Score',
        description:
          pointsToNext > 0
            ? `${pointsToNext} additional score needed to reach next sustainability milestone.`
            : 'New sustainability milestone achieved successfully.',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        time: 'Analytics',
        badge: 'Progress',
        badgeColor:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        actionView: 'dashboard',
      },
    ];
  }, [
    carbonSavedKg,
    habitsRemaining,
    suggestedMeal,
    streakDays,
    pointsToNext,
  ]);

  return (
    <header
      id={id}
      className="sticky top-0 z-40 h-16 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/80"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSidebarToggle}
            className="cursor-pointer rounded-lg border border-zinc-200/50 p-1.5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center gap-2"
            aria-label="Go to homepage"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md">
              <Leaf className="h-5 w-5 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-sm font-bold text-transparent dark:from-emerald-400 dark:to-teal-400">
                Carbon Buddy
              </span>

              <span className="mt-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-300">
                Personal Sustainability Assistant
              </span>
            </div>
          </button>
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <div className="flex items-center gap-1.5 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Flame className="h-4 w-4 fill-orange-500" />
            <span>{streakDays} ACTIVE DAYS</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-4 w-4" />
            <span>{userPoints} ECO SCORE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleNotificationToggle}
              aria-label="Open notifications"
              className={`relative cursor-pointer rounded-xl border p-2 transition-all ${dropdownOpen
                  ? 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800'
                }`}
            >
              <Bell className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />

              {hasUnread && (
                <>
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                </>
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                  }}
                  className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Sustainability Insights
                      </h3>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationNavigation(
                            notification.actionView
                          )
                        }
                        className="group flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950"
                        aria-label={notification.title}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 transition-transform group-hover:scale-105 dark:bg-zinc-800">
                          {notification.icon}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                              {notification.title}
                            </span>

                            <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
                              {notification.time}
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-300">
                            {notification.description}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${notification.badgeColor}`}
                            >
                              {notification.badge}
                            </span>

                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
                              Open <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="text-[10px] italic text-zinc-500 dark:text-zinc-400">
                      AI recommendations generated from your sustainability activity
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}