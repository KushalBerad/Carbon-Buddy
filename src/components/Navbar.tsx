import { ArrowRight, Bell, CheckCircle2, Flame, Leaf, Menu, Sparkles, Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useHabitStore } from '../store/habitStore';
import { useMealStore } from '../store/mealStore';
import { useUserStore } from '../store/userStore';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  id?: string;
  userPoints?: number;
  streakDays?: number;
  onMenuToggle?: () => void;
}

export function Navbar({
  id,
  userPoints: propUserPoints,
  streakDays: propStreakDays,
  onMenuToggle: propOnMenuToggle,
}: NavbarProps) {
  const profile = useUserStore((s) => s.profile);
  const sidebarOpen = useUserStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUserStore((s) => s.setSidebarOpen);
  const setCurrentView = useUserStore((s) => s.setCurrentView);

  const meals = useMealStore((s) => s.meals);
  const habits = useHabitStore((s) => s.habits);

  const userPoints = propUserPoints !== undefined ? propUserPoints : (profile?.points ?? 100);
  const streakDays = propStreakDays !== undefined ? propStreakDays : (profile?.streak ?? 1);
  const onMenuToggle = propOnMenuToggle || (() => setSidebarOpen(!sidebarOpen));

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute dynamic eco-metrics for user experience
  const carbonSavedKg = ((profile?.carbonSavedTotal ?? 0) / 1000).toFixed(1);
  const points = profile?.points ?? 100;
  const currentLevel = profile?.level ?? 1;
  const nextLevelPoints = currentLevel * 250;
  const pointsToNext = nextLevelPoints - points;

  // Find a meal suggestion recommendation
  const suggestedMeal = meals.find((m) => !m.adopted);

  // Remaining list tasks
  const totalHabitsCount = habits.length;
  const checkedHabitsCount = habits.filter((h) => h.checked).length;
  const habitsRemaining = totalHabitsCount - checkedHabitsCount;

  // Real-time custom notifications compiled on existing state
  const notifications = [
    {
      id: 'notif-carbon',
      title: 'Carbon Saved Update',
      description: `Spectacular! Cleared carbon savings hit ${carbonSavedKg}kg CO₂ total limit.`,
      icon: <Leaf className="w-4 h-4 text-emerald-500" />,
      time: 'Real Time',
      badge: 'Savings',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none',
      actionView: 'dashboard'
    },
    {
      id: 'notif-streak',
      title: 'Streak Active',
      description: streakDays > 1
        ? `Green streak verified at ${streakDays} days straight! Keep logging habits.`
        : 'Begin logging eco habits to start building your dynamic multiplier streak!',
      icon: <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10" />,
      time: 'Daily Metric',
      badge: `${streakDays} Days`,
      badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none',
      actionView: 'habits'
    },
    {
      id: 'notif-meal',
      title: 'Sustainable Alternative',
      description: suggestedMeal
        ? `Swap ${suggestedMeal.originalName} with ${suggestedMeal.alternativeName} for a ${suggestedMeal.carbonOffsetGrams}g benefit.`
        : 'Explore our certified custom nutrition alternatives to slash grocery emission footprints.',
      icon: <Trophy className="w-4 h-4 text-teal-400" />,
      time: 'Eco Chef',
      badge: 'Nutrition',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-none',
      actionView: 'meals'
    },
    {
      id: 'notif-habits',
      title: habitsRemaining === 0
        ? 'Eco Score Perfect!'
        : 'Daily Habits Logger',
      description: habitsRemaining === 0
        ? 'Awesome work! You completed all scheduled green habits for today.'
        : `You have ${habitsRemaining} remaining green habit log${habitsRemaining > 1 ? 's' : ''} on today's list.`,
      icon: <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
      time: 'Scheduler',
      badge: habitsRemaining === 0 ? 'Done' : `${habitsRemaining} Left`,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none',
      actionView: 'habits'
    },
    {
      id: 'notif-badges',
      title: 'Badge Milestone progress',
      description: pointsToNext > 0
        ? `Earn ${pointsToNext} points to hit level ${currentLevel + 1} and claim premium rare badges.`
        : `Level ${currentLevel + 1} milestone reached! Save any metric to complete transition.`,
      icon: <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/15" />,
      time: 'Rewards',
      badge: `Lvl ${currentLevel}`,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none',
      actionView: 'achievements'
    }
  ];

  return (
    <header
      id={id}
      className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-150/50 dark:border-zinc-800/50 h-16 transition-all duration-300"
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-750 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden cursor-pointer"
              aria-label="Toggle Side Drawer"
            >
              <Menu className="w-5 h-5 text-zinc-650 dark:text-zinc-300" />
            </button>
          )}

          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="Go to landing page"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <Leaf className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent leading-none">
                Carbon Buddy
              </span>

              <span className="text-[10px] text-zinc-500 dark:text-zinc-300 font-medium mt-0.5">
                Live Sustainably
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Center Indicators / Gamified Info */}
        <div className="hidden md:flex items-center gap-5">
          {/* Flame streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold font-mono text-xs shadow-xs">
            <Flame className="w-4 h-4 fill-amber-500 stroke-amber-600 dark:stroke-amber-400" />
            <span>{streakDays} DAY STREAK</span>
          </div>

          {/* Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-xs shadow-xs">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span>{userPoints} PTS</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3.5">
          {/* Functional Premium notification bell and dropdown helper */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setHasUnread(false);
              }}
              className={`relative p-2 rounded-xl border transition-all text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer outline-none ${dropdownOpen
                  ? 'bg-zinc-100 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700'
                  : 'border-zinc-150/40 dark:border-zinc-800/80'
                }`}
              aria-label="Open notifications center panel"
            >
              <Bell className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              )}
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* Dropdown with smooth animated Framer Motion entrance */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-3.5 w-84 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150/80 dark:border-zinc-800/85 shadow-2xl overflow-hidden focus:outline-none z-50 mr-[-4px]"
                >
                  <div className="px-4.5 py-3.5 border-b border-zinc-150/65 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                      <h3 className="text-sm font-semibold text-zinc-850 dark:text-zinc-150">
                        In-App Activity Feed
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 custom-scrollbar">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          setCurrentView(notif.actionView);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4.5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/60 flex gap-3.5 transition-colors cursor-pointer group"
                      >
                        <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {notif.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {notif.title}
                            </span>
                            <span className="text-[9px] text-zinc-500 dark:text-zinc-300 shrink-0 font-medium">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-300 leading-relaxed font-normal">
                            {notif.description}
                          </p>
                          <div className="pt-1 flex items-center justify-between gap-2.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${notif.badgeColor}`}>
                              {notif.badge}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold">
                              Go <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 text-center">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-300 italic">
                      Live synched with active user carbon statistics
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
