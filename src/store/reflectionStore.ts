import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeeklyReflection } from '../types';
import { useUserStore } from './userStore';

interface ReflectionState {
  reflections: WeeklyReflection[];
  isGeneratingReflection: boolean;
  generateReflection: () => Promise<void>;
  resetReflections: () => void;
}

const initialReflections: WeeklyReflection[] = [
  {
    weekId: 'ref-init',
    date: 'June 12, 2026',
    dietScore: 75,
    commuteScore: 80,
    energyScore: 68,
    aiFeedback: "You are doing great on public transit, alex! To maximize score factors, consider turning off heavy standby chargers and reducing beef consumption. That will easily double your daily carbon offset.",
  }
];

export const useReflectionStore = create<ReflectionState>()(
  persist(
    (set) => ({
      reflections: initialReflections,
      isGeneratingReflection: false,
      generateReflection: async () => {
        const profile = useUserStore.getState().profile;
        if (!profile) return;

        set({ isGeneratingReflection: true });
        try {
          const response = await fetch('/api/gemini/reflection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: profile.name,
              dietPreference: profile.dietPreference,
              commuteMode: profile.commuteMode,
              totalSavedCarbon: profile.carbonSavedTotal,
            }),
          });

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          const newReport: WeeklyReflection = {
            weekId: `ref-${Date.now()}`,
            date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            dietScore: data.scoreDiet || 85,
            commuteScore: data.scoreCommute || 80,
            energyScore: data.scoreEnergy || 75,
            aiFeedback: data.aiFeedback || 'Fabulous cycle! Leverage travel commutes to continue streak multipliers.',
          };

          set((state) => ({ reflections: [newReport, ...state.reflections] }));
        } catch (err) {
          console.warn('Reflection proxy fell back to smart simulation:', err);

          const simulatedReport: WeeklyReflection = {
            weekId: `ref-${Date.now()}`,
            date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            dietScore: profile.dietPreference === 'vegan' ? 95 : profile.dietPreference === 'vegetarian' ? 82 : 65,
            commuteScore: profile.commuteMode === 'transit' ? 90 : profile.commuteMode === 'hybrid' ? 70 : 45,
            energyScore: 78,
            aiFeedback: `Splendid weekly progress, ${profile.name}! Swapping transit options and logging milestones saved a massive ${profile.carbonSavedTotal}g of CO₂ this cycle. We recommend keeping energy power strips unplugged for more cost benefits.`,
          };

          setTimeout(() => {
            set((state) => ({ reflections: [simulatedReport, ...state.reflections] }));
          }, 1000);
        } finally {
          set({ isGeneratingReflection: false });
        }
      },
      resetReflections: () => set({ reflections: initialReflections, isGeneratingReflection: false }),
    }),
    {
      name: 'carbon-buddy-reflection-store',
    }
  )
);
