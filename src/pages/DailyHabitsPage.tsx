import {
  CheckCircle2,
  Info,
  Plus,
  Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { HabitToggle } from '../components/HabitToggle';
import { Modal } from '../components/Modal';
import { useHabitStore } from '../store/habitStore';

const HABIT_CATEGORIES = [
  'transport',
  'food',
  'energy',
  'waste',
  'water',
] as const;

type HabitCategory = typeof HABIT_CATEGORIES[number];

export const DailyHabitsPage = React.memo(function DailyHabitsPage() {
  const habits = useHabitStore((state) => state.habits);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const addHabit = useHabitStore((state) => state.addHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [offset, setOffset] = useState(300);
  const [money, setMoney] = useState(1.5);
  const [category, setCategory] = useState<HabitCategory>('energy');

  const completedHabits = useMemo(
    () => habits.filter((habit) => habit.checked),
    [habits]
  );

  const completedCount = completedHabits.length;
  const totalCount = habits.length;

  const progressPercent = useMemo(() => {
    if (totalCount === 0) return 0;
    return (completedCount / totalCount) * 100;
  }, [completedCount, totalCount]);

  const resetForm = useCallback(() => {
    setLabel('');
    setOffset(300);
    setMoney(1.5);
    setCategory('energy');
  }, []);

  const handleCreateHabit = useCallback(() => {
    const trimmed = label.trim();

    if (!trimmed) {
      return;
    }

    addHabit(trimmed, offset, money, category);
    resetForm();
    setIsModalOpen(false);
  }, [label, offset, money, category, addHabit, resetForm]);

  const handleDeleteHabit = useCallback(
    (habitId: string) => {
      deleteHabit(habitId);
    },
    [deleteHabit]
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Sustainable Daily Habits
          </h1>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-300">
            Track eco-friendly actions and build measurable daily carbon reduction habits.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Eco Habit
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          Completing sustainable actions every day helps reduce your carbon footprint,
          maintain eco streaks and improve long-term environmental impact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
            Daily Sustainability Actions
          </h2>

          <AnimatePresence mode="popLayout">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="group relative"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <HabitToggle
                      label={habit.label}
                      carbonOffsetGrams={habit.offset}
                      moneySaved={habit.money}
                      checked={habit.checked}
                      onChange={(checked) =>
                        toggleHabit(habit.id, checked)
                      }
                      category={habit.category}
                    />
                  </div>

                  {habit.id.startsWith('custom-') && (
                    <button
                      type="button"
                      title="Delete custom habit"
                      aria-label="Delete custom habit"
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="rounded-xl border border-zinc-200 p-3 text-zinc-500 transition-all hover:bg-rose-500/10 hover:text-rose-500 dark:border-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
              Progress Summary
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-300">
                Completion
              </span>

              <span className="font-mono text-sm font-bold text-emerald-500">
                {completedCount}/{totalCount}
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="max-h-48 space-y-2 overflow-y-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
              {completedCount === 0 ? (
                <p className="py-4 text-center text-xs italic text-zinc-500">
                  No completed sustainability actions yet.
                </p>
              ) : (
                completedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                    <span className="flex-1 truncate">
                      {habit.label}
                    </span>

                    <span className="shrink-0 font-mono text-emerald-500">
                      +{habit.offset}g
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Sustainable Habit"
        description="Add a custom environmentally friendly daily action."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateHabit}
            >
              Save Habit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="habit-name"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Habit Name
            </label>

            <input
              id="habit-name"
              type="text"
              value={label}
              placeholder="Example: Used bicycle instead of car"
              onChange={(event) => setLabel(event.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <div className="space-y-1">
            <div className="mb-1 flex justify-between text-xs">
              <label
                htmlFor="carbon-slider"
                className="text-zinc-600 dark:text-zinc-400"
              >
                Estimated Carbon Saved
              </label>

              <span className="font-mono text-emerald-500">
                {offset}g CO₂
              </span>
            </div>

            <input
              id="carbon-slider"
              name="carbon-slider"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={offset}
              title="Adjust estimated carbon saved"
              onChange={(event) =>
                setOffset(Number(event.target.value))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="mb-1 flex justify-between text-xs">
              <label
                htmlFor="money-slider"
                className="text-zinc-600 dark:text-zinc-400"
              >
                Estimated Money Saved
              </label>

              <span className="font-mono text-emerald-500">
                ${money.toFixed(2)}
              </span>
            </div>

            <input
              id="money-slider"
              name="money-slider"
              type="range"
              min={0}
              max={15}
              step={0.5}
              value={money}
              title="Adjust estimated money saved"
              onChange={(event) =>
                setMoney(Number(event.target.value))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Category
            </label>

            <div className="mt-2 grid grid-cols-5 gap-2">
              {HABIT_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-lg border py-2 text-[10px] font-semibold uppercase transition-all ${category === item
                    ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600'
                    : 'border-zinc-200 text-zinc-500 dark:border-zinc-800'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});