/**
 * Carbon Buddy Weekly Reflection Store
 *
 * Responsible for:
 * - AI-generated sustainability reflections
 * - Carbon footprint performance analysis
 * - Weekly environmental impact reporting
 * - Eco habit behavioral feedback generation
 *
 * Uses persistent Zustand state management.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeeklyReflection } from '../types';
import { useUserStore } from './userStore';

/**
 * Sustainability scoring defaults.
 */
const DEFAULT_DIET_SCORE = 85;
const DEFAULT_COMMUTE_SCORE = 80;
const DEFAULT_ENERGY_SCORE = 75;
const SIMULATION_DELAY_MS = 1000;

/**
 * Default starter reflection dataset.
 */
const INITIAL_REFLECTIONS: WeeklyReflection[] = [
  {
    weekId: 'reflection-initial',
    date: 'June 12, 2026',
    dietScore: 75,
    commuteScore: 80,
    energyScore: 68,
    aiFeedback:
      'Strong sustainability progress detected. Public transit usage and mindful energy consumption are improving your long-term carbon reduction impact.',
  },
];

/**
 * Reflection state contract.
 */
interface ReflectionState {
  reflections: WeeklyReflection[];
  isGeneratingReflection: boolean;

  generateReflection: () => Promise<void>;
  resetReflections: () => void;
}

/**
 * Generates standardized reflection date string.
 */
const generateReflectionDate = (): string =>
  new Date().toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/**
 * Carbon Buddy reflection persistence store.
 */
export const useReflectionStore = create<ReflectionState>()(
  persist(
    (set) => ({
      reflections: INITIAL_REFLECTIONS,
      isGeneratingReflection: false,

      /**
       * Generates AI-powered sustainability reflection.
       */
      generateReflection: async () => {
        const activeUserProfile =
          useUserStore.getState().profile;

        if (!activeUserProfile) {
          return;
        }

        set({
          isGeneratingReflection: true,
        });

        try {
          const reflectionApiResponse = await fetch(
            '/api/gemini/reflection',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: activeUserProfile.name,
                dietPreference:
                  activeUserProfile.dietPreference,
                commuteMode:
                  activeUserProfile.commuteMode,
                totalSavedCarbon:
                  activeUserProfile.carbonSavedTotal,
              }),
            }
          );

          const reflectionPayload =
            await reflectionApiResponse.json();

          if (reflectionPayload.error) {
            throw new Error(
              reflectionPayload.error
            );
          }

          const generatedReflection: WeeklyReflection =
            {
              weekId: `reflection-${Date.now()}`,
              date: generateReflectionDate(),

              dietScore:
                reflectionPayload.scoreDiet ??
                DEFAULT_DIET_SCORE,

              commuteScore:
                reflectionPayload.scoreCommute ??
                DEFAULT_COMMUTE_SCORE,

              energyScore:
                reflectionPayload.scoreEnergy ??
                DEFAULT_ENERGY_SCORE,

              aiFeedback:
                reflectionPayload.aiFeedback ??
                'Excellent eco performance. Continue sustainable daily habits to maximize your environmental impact score.',
            };

          set((state) => ({
            reflections: [
              generatedReflection,
              ...state.reflections,
            ],
          }));
        } catch (reflectionError) {
          console.warn(
            'AI reflection unavailable. Using local sustainability simulation.',
            reflectionError
          );

          const simulatedReflection: WeeklyReflection =
            {
              weekId: `reflection-${Date.now()}`,
              date: generateReflectionDate(),

              dietScore:
                activeUserProfile.dietPreference ===
                'vegan'
                  ? 95
                  : activeUserProfile.dietPreference ===
                    'vegetarian'
                  ? 82
                  : 65,

              commuteScore:
                activeUserProfile.commuteMode ===
                'transit'
                  ? 90
                  : activeUserProfile.commuteMode ===
                    'hybrid'
                  ? 70
                  : 45,

              energyScore: 78,

              aiFeedback: `Great weekly sustainability progress, ${activeUserProfile.name}. Your environmentally conscious actions prevented approximately ${activeUserProfile.carbonSavedTotal}g of CO₂ emissions. Continue reducing unnecessary energy consumption to improve future carbon savings.`,
            };

          setTimeout(() => {
            set((state) => ({
              reflections: [
                simulatedReflection,
                ...state.reflections,
              ],
            }));
          }, SIMULATION_DELAY_MS);
        } finally {
          set({
            isGeneratingReflection: false,
          });
        }
      },

      /**
       * Resets reflection analytics state.
       */
      resetReflections: () =>
        set({
          reflections: INITIAL_REFLECTIONS,
          isGeneratingReflection: false,
        }),
    }),

    {
      name: 'carbon-buddy-reflection-store',
    }
  )
);