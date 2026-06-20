import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';

export interface Habit {
  id: string;
  label: string;
  offset: number;
  money: number;
  checked: boolean;
  category: 'transport' | 'food' | 'energy' | 'waste' | 'water';
}

interface HabitState {
  habits: Habit[];
  toggleHabit: (id: string, checked: boolean) => void;
  addHabit: (label: string, offset: number, money: number, category: 'transport' | 'food' | 'energy' | 'waste' | 'water') => void;
  deleteHabit: (id: string) => void;
  resetHabits: () => void;
}

const initialHabits: Habit[] = [
  { id: 'h1', label: 'Biked 4 miles to work instead of ride-sharing', offset: 1200, money: 7.50, checked: false, category: 'transport' },
  { id: 'h2', label: 'Ordered a fully plant-based meal alternative', offset: 800, money: 3.20, checked: false, category: 'food' },
  { id: 'h3', label: 'Shut off continuous computer power strips', offset: 350, money: 1.10, checked: false, category: 'energy' },
  { id: 'h4', label: 'Took a short 4-minute water-conscious shower', offset: 450, money: 0.80, checked: false, category: 'water' },
  { id: 'h5', label: 'Avoided buying a single-use plastic water bottle', offset: 150, money: 2.50, checked: false, category: 'waste' },
];

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: initialHabits,
      toggleHabit: (id, checked) => set((state) => {
        const profile = useUserStore.getState().profile;
        const nextHabits = state.habits.map((h) => {
          if (h.id === id) {
            if (profile) {
              const deltaPoints = checked ? 25 : -25;
              const deltaCarbon = checked ? h.offset : -h.offset;
              const deltaMoney = checked ? h.money : -h.money;

              const nextPoints = Math.max(0, profile.points + deltaPoints);
              const nextLevel = Math.floor(nextPoints / 250) + 1;

              useUserStore.getState().setProfile({
                ...profile,
                points: nextPoints,
                level: nextLevel,
                carbonSavedTotal: Math.max(0, profile.carbonSavedTotal + deltaCarbon),
                moneySavedTotal: Math.max(0, profile.moneySavedTotal + deltaMoney),
              });
            }
            return { ...h, checked };
          }
          return h;
        });
        return { habits: nextHabits };
      }),
      addHabit: (label, offset, money, category) => set((state) => ({
        habits: [
          ...state.habits,
          {
            id: `custom-${Date.now()}`,
            label,
            offset,
            money,
            checked: false,
            category,
          }
        ]
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
      })),
      resetHabits: () => set({ habits: initialHabits }),
    }),
    {
      name: 'carbon-buddy-habit-store',
    }
  )
);
