import {
  Award,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FlameKindling,
  Flower,
  LayoutDashboard,
  Leaf,
  MapPinCheckInside,
  MessageSquareCode,
  Settings,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useMemo } from 'react';
import { useUserStore } from '../store/userStore';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  id?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  activeId?: string;
  onSelect?: (id: string) => void;
  streakDays?: number;
}

export function Sidebar({
  id,
  isOpen: propIsOpen,
  onToggle: propOnToggle,
  activeId: propActiveId,
  onSelect: propOnSelect,
  streakDays: propStreakDays,
}: SidebarProps) {
  const profile = useUserStore((state) => state.profile);
  const sidebarOpen = useUserStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUserStore((state) => state.setSidebarOpen);
  const currentView = useUserStore((state) => state.currentView);
  const setCurrentView = useUserStore((state) => state.setCurrentView);

  const isOpen = propIsOpen ?? sidebarOpen;
  const activeId = propActiveId ?? currentView;
  const streakDays = propStreakDays ?? profile?.streak ?? 1;

  const onToggle =
    propOnToggle ?? (() => setSidebarOpen(!sidebarOpen));

  const onSelect =
    propOnSelect ??
    ((view: string) => {
      setCurrentView(view);
    });

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [activeId, setSidebarOpen]);

  const menuItems = useMemo<SidebarItem[]>(
    () => [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        id: 'habits',
        label: 'Daily Habits',
        icon: <CheckSquare className="w-5 h-5" />,
      },
      {
        id: 'reflection',
        label: 'Weekly Reflection',
        icon: <Calendar className="w-5 h-5" />,
      },
      {
        id: 'coach',
        label: 'AI Coach Chat',
        icon: <MessageSquareCode className="w-5 h-5" />,
      },
      {
        id: 'meals',
        label: 'AI Eco Meals',
        icon: <UtensilsCrossed className="w-5 h-5" />,
      },
      {
        id: 'location',
        label: 'Eco Finder',
        icon: <MapPinCheckInside className="w-5 h-5" />,
      },
      {
        id: 'bloom',
        label: 'Earth Bloom',
        icon: <Flower className="w-5 h-5" />,
      },
      {
        id: 'achievements',
        label: 'Achievements',
        icon: <Award className="w-5 h-5" />,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
      },
    ],
    [],
  );

  const streakProgress = Math.min(100, (streakDays / 7) * 100);

  const renderMenuButton = (item: SidebarItem, mobile = false) => {
    const isActive = activeId === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onSelect(item.id);

          if (mobile && window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
        aria-label={item.label}
        className={`relative flex w-full items-center justify-start rounded-xl p-3 transition-all duration-200 ${
          isActive
            ? 'bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-400'
            : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
        }`}
      >
        {isActive && !mobile && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 h-6 w-1 rounded-r bg-emerald-500"
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30,
            }}
          />
        )}

        <div className="flex w-full items-center gap-3">
          <span>{item.icon}</span>

          {(isOpen || mobile) && (
            <span className="truncate text-sm">{item.label}</span>
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Desktop */}
      <aside
        id={id}
        className={`fixed bottom-0 left-0 top-16 z-30 hidden flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 lg:flex ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-2 overflow-y-auto px-3 py-6"
        >
          {menuItems.map((item) => renderMenuButton(item))}
        </nav>

        {isOpen && (
          <div className="mx-3 mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <FlameKindling className="w-4 h-4 text-orange-500" />
              </div>

              <div>
                <p className="text-xs font-semibold">Eco Streak</p>
                <p className="text-[10px] text-zinc-500">
                  {streakDays} Days Active
                </p>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                style={{ width: `${streakProgress}%` }}
              />
            </div>

            <p className="mt-2 text-center text-[10px] text-zinc-500">
              Maintain habits to continue progress
            </p>
          </div>
        )}

        <div className="flex justify-end border-t border-zinc-200 p-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="rounded-lg border border-zinc-200 p-2 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 220,
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>

                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-sm font-bold text-transparent">
                    Carbon Buddy
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onToggle}
                  aria-label="Close sidebar"
                  className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
              >
                {menuItems.map((item) =>
                  renderMenuButton(item, true),
                )}
              </nav>

              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <FlameKindling className="w-4 h-4 text-orange-500" />

                    <div>
                      <p className="text-xs font-semibold">
                        Eco Streak
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {streakDays} Days
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                      style={{ width: `${streakProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}