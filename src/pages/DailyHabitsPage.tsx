import {
  CheckCircle2,
  Info,
  Plus,
  Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { HabitToggle } from '../components/HabitToggle';
import { Modal } from '../components/Modal';
import { Habit, useHabitStore } from '../store/habitStore';

export interface DailyHabitsPageProps {
  habits?: Habit[];
  onToggle?: (id: string, checked: boolean) => void;
  onAddHabit?: (label: string, offset: number, money: number, category: 'transport' | 'food' | 'energy' | 'waste' | 'water') => void;
  onDeleteHabit?: (id: string) => void;
}

export const DailyHabitsPage = React.memo(function DailyHabitsPage({ 
  habits: propHabits, 
  onToggle: propOnToggle, 
  onAddHabit: propOnAddHabit, 
  onDeleteHabit: propOnDeleteHabit 
}: DailyHabitsPageProps) {
  const storeHabits = useHabitStore((s) => s.habits);
  const storeToggleHabit = useHabitStore((s) => s.toggleHabit);
  const storeAddHabit = useHabitStore((s) => s.addHabit);
  const storeDeleteHabit = useHabitStore((s) => s.deleteHabit);

  const habits = propHabits || storeHabits;
  const onToggle = propOnToggle || storeToggleHabit;
  const onAddHabit = propOnAddHabit || storeAddHabit;
  const onDeleteHabit = propOnDeleteHabit || storeDeleteHabit;

  const completedHabits = React.useMemo(() => habits.filter(h => h.checked), [habits]);
  const completedCount = completedHabits.length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newOffset, setNewOffset] = useState(300);
  const [newMoney, setNewMoney] = useState(1.50);
  const [newCategory, setNewCategory] = useState<'transport' | 'food' | 'energy' | 'waste' | 'water'>('energy');

  const handleCreate = () => {
    if (!newLabel.trim()) return;
    onAddHabit(newLabel, newOffset, newMoney, newCategory);
    setNewLabel('');
    setNewOffset(300);
    setNewMoney(1.50);
    setNewCategory('energy');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daily Habits Checklist
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
            Check off actions as they occur. Doing so active-syncs points, levels, and metric logs.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4.5 h-4.5" />}
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Create custom habit"
        >
          Create Custom Habit
        </Button>
      </div>

      {/* Overview Hint bar */}
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
          Daily habits are reset every 24 hours. Maintaining streak goals requires completing at least <strong className="text-emerald-500 dark:text-emerald-400 font-semibold">2 lifestyle actions</strong> every consecutive day. Customize your log list with the create button.
        </p>
      </div>

      {/* Habit Lists sorted by category blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actual Actions column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Available Daily Actions</h2>

          <AnimatePresence mode="popLayout">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <HabitToggle
                      label={habit.label}
                      carbonOffsetGrams={habit.offset}
                      moneySaved={habit.money}
                      checked={habit.checked}
                      onChange={(checked) => onToggle(habit.id, checked)}
                      category={habit.category}
                    />
                  </div>

                  {/* Allow deleting custom habits */}
                  {onDeleteHabit && habit.id.startsWith('custom-') && (
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-3 rounded-2xl border border-zinc-150/40 dark:border-zinc-800 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      aria-label="Delete custom checklist element"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Informative Stats Sidebar for completed habits */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-505">Habits Accomplished</h3>

            {/* Micro stats counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-300 font-light">Status:</span>
              <span className="text-sm font-bold font-mono text-emerald-500">
                {completedCount} of {totalCount} Done
              </span>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist items recap list */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 max-h-48 overflow-y-auto">
              {completedCount === 0 ? (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-300 italic text-center py-4 font-light">No entries logged yet. Tick action circles on left!</p>
              ) : (
                completedHabits.map(h => (
                  <div key={h.id} className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-300 leading-normal">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate flex-1">{h.label}</span>
                    <span className="font-mono text-emerald-500 shrink-0">+{h.offset}g</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* 4. Overlay Modal to Create Custom Habit */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Lifestyle Habit Alternative"
        description="Configure a recurring custom sustainable act."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)} aria-label="Cancel habit creation">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate} aria-label="Create custom habit">
              Insert To Checklist
            </Button>
          </>
        }
      >
        <div className="space-y-4 font-sans text-left">
          
          {/* Label title input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Action Label Name</label>
            <input
              type="text"
              placeholder="e.g., Unplugged multiple heavy desktop strips during holiday"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          {/* Slider for carbon footprint */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-zinc-600 dark:text-zinc-405">Grams Carbon Offset</label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{newOffset}g CO₂</span>
            </div>
            <input  aria-label="Set estimated carbon offset in grams"
              type="range"
              min="50"
              max="2000"
              step="50"
              value={newOffset}
              onChange={(e) => setNewOffset(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-100 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider for cost savings */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-zinc-600 dark:text-zinc-405">Estimated USD Saved</label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${newMoney.toFixed(2)}</span>
            </div>
            <input  aria-label="Set estimated money saved in USD"
              type="range"
              min="0.00"
              max="15.00"
              step="0.50"
              value={newMoney}
              onChange={(e) => setNewMoney(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-100 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Sector Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-605 dark:text-zinc-300">Sector / Category</label>
            <div className="grid grid-cols-5 gap-2">
              {(['transport', 'food', 'energy', 'waste', 'water'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    newCategory === cat
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                  aria-label={`Select category ${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
});

