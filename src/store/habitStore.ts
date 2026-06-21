/**
 * Carbon Buddy Habit Intelligence Store
 *
 * Responsible for:
 * - Sustainable habit tracking
 * - Carbon footprint reduction monitoring
 * - Eco-behavior reward engine
 * - Daily environmental impact calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';

/**
 * Supported sustainability categories.
 */
type HabitCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'waste'
  | 'water';

/**
 * Habit model.
 */
export interface Habit {
  id: string;
  label: string;
  offset: number;
  money: number;
  checked: boolean;
  category: HabitCategory;
}

/**
 * Store contract.
 */
interface HabitState {
  habits: Habit[];

  toggleHabit: (
    id: string,
    checked: boolean
  ) => void;

  addHabit: (
    label: string,
    offset: number,
    money: number,
    category: HabitCategory
  ) => void;

  deleteHabit: (id: string) => void;
  resetHabits: () => void;
}

/**
 * Reward engine constants.
 */
const HABIT_REWARD_POINTS = 25;
const LEVEL_DIVISOR = 250;

/**
 * Default sustainability habits.
 */
const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    label:
      'Biked 4 miles instead of using ride-sharing transport',
    offset: 1200,
    money: 7.5,
    checked: false,
    category: 'transport',
  },
  {
    id: 'h2',
    label:
      'Chose a fully plant-based sustainable meal option',
    offset: 800,
    money: 3.2,
    checked: false,
    category: 'food',
  },
  {
    id: 'h3',
    label:
      'Turned off unnecessary standby electrical devices',
    offset: 350,
    money: 1.1,
    checked: false,
    category: 'energy',
  },
  {
    id: 'h4',
    label:
      'Completed a water-conscious short shower routine',
    offset: 450,
    money: 0.8,
    checked: false,
    category: 'water',
  },
  {
    id: 'h5',
    label:
      'Avoided purchasing single-use plastic bottle waste',
    offset: 150,
    money: 2.5,
    checked: false,
    category: 'waste',
  },
];

/**
 * Applies sustainability rewards to user profile.
 */
const updateEnvironmentalRewards = (
  habit: Habit,
  isCompleted: boolean
): void => {
  const currentProfile =
    useUserStore.getState().profile;

  if (!currentProfile) {
    return;
  }

  const pointDelta = isCompleted
    ? HABIT_REWARD_POINTS
    : -HABIT_REWARD_POINTS;

  const carbonDelta = isCompleted
    ? habit.offset
    : -habit.offset;

  const moneyDelta = isCompleted
    ? habit.money
    : -habit.money;

  const updatedPoints = Math.max(
    0,
    currentProfile.points + pointDelta
  );

  const updatedLevel =
    Math.floor(
      updatedPoints / LEVEL_DIVISOR
    ) + 1;

  useUserStore.getState().setProfile({
    ...currentProfile,

    points: updatedPoints,

    level: updatedLevel,

    carbonSavedTotal: Math.max(
      0,
      currentProfile.carbonSavedTotal +
        carbonDelta
    ),

    moneySavedTotal: Math.max(
      0,
      currentProfile.moneySavedTotal +
        moneyDelta
    ),
  });
};

/**
 * Carbon Buddy sustainability habit store.
 */
export const useHabitStore =
  create<HabitState>()(
    persist(
      (set) => ({
        habits: INITIAL_HABITS,

        /**
         * Marks sustainable habit completion.
         */
        toggleHabit: (
          habitId,
          checked
        ) =>
          set((state) => {
            const updatedHabits =
              state.habits.map(
                (habit) => {
                  if (
                    habit.id === habitId
                  ) {
                    updateEnvironmentalRewards(
                      habit,
                      checked
                    );

                    return {
                      ...habit,
                      checked,
                    };
                  }

                  return habit;
                }
              );

            return {
              habits: updatedHabits,
            };
          }),

        /**
         * Adds custom eco-friendly habit.
         */
        addHabit: (
          label,
          offset,
          money,
          category
        ) =>
          set((state) => ({
            habits: [
              ...state.habits,
              {
                id: `custom-${Date.now()}`,
                label,
                offset,
                money,
                checked: false,
                category,
              },
            ],
          })),

        /**
         * Removes habit from tracker.
         */
        deleteHabit: (
          habitId
        ) =>
          set((state) => ({
            habits:
              state.habits.filter(
                (habit) =>
                  habit.id !== habitId
              ),
          })),

        /**
         * Resets habit tracking state.
         */
        resetHabits: () =>
          set({
            habits: INITIAL_HABITS,
          }),
      }),

      {
        name:
          'carbon-buddy-habit-store',
      }
    )
  );