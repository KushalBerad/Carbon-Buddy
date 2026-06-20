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
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
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
  const profile = useUserStore((s) => s.profile);
  const isOpenStore = useUserStore((s) => s.sidebarOpen);
  const onToggleStore = useUserStore((s) => s.setSidebarOpen);
  const activeIdStore = useUserStore((s) => s.currentView);
  const onSelectStore = useUserStore((s) => s.setCurrentView);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isOpenStore;
  const onToggle = propOnToggle || (() => onToggleStore(!isOpenStore));
  const activeId = propActiveId !== undefined ? propActiveId : activeIdStore;
  const onSelect = propOnSelect || onSelectStore;
  const streakDays = propStreakDays !== undefined ? propStreakDays : (profile?.streak ?? 1);
  // Navigation tabs matching Core features requested
  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'habits', label: 'Daily Habits', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'reflection', label: 'Weekly Reflection', icon: <Calendar className="w-5 h-5" /> },
    { id: 'coach', label: 'AI Coach Chat', icon: <MessageSquareCode className="w-5 h-5" /> },
    { id: 'meals', label: 'AI Eco Meals', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'location', label: 'Eco Finder', icon: <MapPinCheckInside className="w-5 h-5" /> },
    { id: 'bloom', label: 'Earth Bloom', icon: <Flower className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id={id}
        className={`fixed top-16 bottom-0 left-0 z-35 bg-white dark:bg-zinc-900 border-r border-zinc-150/50 dark:border-zinc-800/50 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } hidden lg:flex`}
      >
        {/* Scrollable Navigation section */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center justify-start rounded-xl p-3 transition-all duration-200 cursor-pointer relative outline-none group ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-450 dark:bg-emerald-500/5 font-semibold'
                    : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {/* Dynamic slider background element for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute left-0 w-1.2 h-6 rounded-r-md bg-emerald-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3 w-full">
                  <span className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    {item.icon}
                  </span>
                  
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      className="text-sm truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Gamified Habit Streak Indicator Widget at Bottom */}
        {isOpen && (
          <div className="p-4 mx-3 mb-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150/40 dark:border-zinc-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/15">
                <FlameKindling className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Eco Green Streak</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-300">{streakDays} Days Strong</p>
              </div>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full" style={{ width: `${(streakDays / 7) * 100}%` }} />
            </div>
            <span className="text-[9px] text-zinc-500 dark:text-zinc-300 italic text-center font-light">
              Keep logging to extend your streak!
            </span>
          </div>
        )}

        {/* Collapse/Expand toggle handle */}
        <div className="p-4 border-t border-zinc-150/40 dark:border-zinc-800/80 flex items-center justify-end">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/80 hover:bg-zinc-150/50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-300 transition-colors cursor-pointer outline-none"
          >
            {isOpen ? <ChevronLeft className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay for mobile screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 z-45 bg-zinc-950/60 lg:hidden cursor-pointer"
            />
            {/* Slide-out Drawer container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col lg:hidden border-r border-zinc-150/50 dark:border-zinc-800/50"
            >
              {/* Header inside Mobile Drawer */}
              <div className="h-16 border-b border-zinc-150/50 dark:border-zinc-800/50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                    <Leaf className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Carbon Buddy
                  </span>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850 text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  aria-label="Close mobile navigation modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Navigation links */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        onToggle(); // Automatically close mobile drawer upon navigation
                      }}
                      className={`w-full flex items-center justify-start rounded-xl p-3 transition-all duration-200 cursor-pointer relative outline-none ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-450 dark:bg-emerald-500/5 font-semibold'
                          : 'text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className={`shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm truncate">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Habit Streak Widget at Bottom of Mobile Drawer */}
              <div className="p-4 border-t border-zinc-150/40 dark:border-zinc-800/80">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150/40 dark:border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded-md bg-orange-500/15">
                      <FlameKindling className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px]">Eco Green Streak</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-300">{streakDays} Days</p>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (streakDays / 7) * 100)}%` }} />
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
