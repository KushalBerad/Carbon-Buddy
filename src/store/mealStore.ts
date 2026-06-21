/**
 * Carbon Buddy Meal Intelligence Store
 *
 * Responsible for:
 * - AI-generated sustainable meal alternatives
 * - Carbon footprint reduction through food choices
 * - Eco-friendly nutrition recommendations
 * - Rewarding sustainable food adoption behavior
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MealAlternative } from '../types';
import { useUserStore } from './userStore';

/**
 * Reward and sustainability constants.
 */
const MEAL_REWARD_POINTS = 40;
const LEVEL_DIVISOR = 250;
const DEFAULT_CARBON_OFFSET = 500;
const DEFAULT_PRICE_SAVING = 1.5;
const SIMULATION_DELAY_MS = 1000;

/**
 * Initial sustainable meal dataset.
 */
const INITIAL_MEALS: MealAlternative[] = [
  {
    id: 'meal-1',
    originalName: '1/2 lb Beef Burger Patties',
    alternativeName: 'Lentil & Portobello Mushroom Burger',
    carbonOffsetGrams: 900,
    priceSavedUSD: 2.5,
    shortImpactDescription:
      'Replacing beef significantly reduces methane emissions and lowers total meal carbon footprint.',
    adopted: false,
  },
  {
    id: 'meal-2',
    originalName: 'Full Dairy Milk Carton',
    alternativeName: 'Organic Oat & Soy Milk Blend',
    carbonOffsetGrams: 450,
    priceSavedUSD: 1.2,
    shortImpactDescription:
      'Plant-based dairy alternatives require less land and generate lower greenhouse gas emissions.',
    adopted: false,
  },
  {
    id: 'meal-3',
    originalName: 'Commercial Pork Sausages',
    alternativeName: 'Seasoned Chickpea Protein Sausage',
    carbonOffsetGrams: 600,
    priceSavedUSD: 1.8,
    shortImpactDescription:
      'Legume-based protein alternatives dramatically reduce livestock production emissions.',
    adopted: false,
  },
];

/**
 * Meal store contract.
 */
interface MealState {
  meals: MealAlternative[];
  isGeneratingMeal: boolean;

  adoptMeal: (id: string) => void;
  generateCustomMeal: (
    baseIngredient: string
  ) => Promise<void>;
  resetMeals: () => void;
}

/**
 * Applies sustainability rewards to user profile.
 */
const rewardSustainableChoice = (
  selectedMeal: MealAlternative
): void => {
  const currentProfile =
    useUserStore.getState().profile;

  if (!currentProfile || selectedMeal.adopted) {
    return;
  }

  const updatedPoints =
    currentProfile.points + MEAL_REWARD_POINTS;

  const updatedLevel =
    Math.floor(updatedPoints / LEVEL_DIVISOR) + 1;

  useUserStore.getState().setProfile({
    ...currentProfile,
    points: updatedPoints,
    level: updatedLevel,
    carbonSavedTotal:
      currentProfile.carbonSavedTotal +
      selectedMeal.carbonOffsetGrams,
    moneySavedTotal:
      currentProfile.moneySavedTotal +
      selectedMeal.priceSavedUSD,
  });
};

/**
 * Carbon Buddy meal intelligence persistence store.
 */
export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      meals: INITIAL_MEALS,
      isGeneratingMeal: false,

      /**
       * Rewards adoption of sustainable meal option.
       */
      adoptMeal: (mealId) =>
        set((state) => {
          const updatedMeals =
            state.meals.map((meal) => {
              if (meal.id === mealId) {
                rewardSustainableChoice(meal);

                return {
                  ...meal,
                  adopted: true,
                };
              }

              return meal;
            });

          return {
            meals: updatedMeals,
          };
        }),

      /**
       * Generates AI-powered sustainable meal substitute.
       */
      generateCustomMeal: async (
        baseIngredient
      ) => {
        set({
          isGeneratingMeal: true,
        });

        try {
          const mealApiResponse = await fetch(
            '/api/gemini/meal',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                ingredient: baseIngredient,
              }),
            }
          );

          const mealPayload =
            await mealApiResponse.json();

          if (mealPayload.error) {
            throw new Error(
              mealPayload.error
            );
          }

          const generatedMeal: MealAlternative =
            {
              id: `meal-custom-${Date.now()}`,
              originalName: baseIngredient,

              alternativeName:
                mealPayload.alternativeName ??
                'Organic Soy Protein Blend',

              carbonOffsetGrams:
                mealPayload.carbonOffsetGrams ??
                DEFAULT_CARBON_OFFSET,

              priceSavedUSD:
                mealPayload.priceSavedUSD ??
                DEFAULT_PRICE_SAVING,

              shortImpactDescription:
                mealPayload.shortImpactDescription ??
                'Sustainable plant-based food alternatives significantly reduce agricultural carbon emissions.',

              adopted: false,
            };

          set((state) => ({
            meals: [
              generatedMeal,
              ...state.meals,
            ],
          }));
        } catch (mealGenerationError) {
          console.warn(
            'AI meal generation unavailable. Using sustainability simulation.',
            mealGenerationError
          );

          const simulatedMeal: MealAlternative =
            {
              id: `meal-custom-${Date.now()}`,
              originalName: baseIngredient,

              alternativeName: `Roasted Chickpea ${baseIngredient} Alternative`,

              carbonOffsetGrams: 400,
              priceSavedUSD: 1.25,

              shortImpactDescription:
                'Legume-based substitutes reduce environmental impact by minimizing livestock production emissions.',

              adopted: false,
            };

          setTimeout(() => {
            set((state) => ({
              meals: [
                simulatedMeal,
                ...state.meals,
              ],
            }));
          }, SIMULATION_DELAY_MS);
        } finally {
          set({
            isGeneratingMeal: false,
          });
        }
      },

      /**
       * Resets meal recommendation state.
       */
      resetMeals: () =>
        set({
          meals: INITIAL_MEALS,
          isGeneratingMeal: false,
        }),
    }),

    {
      name: 'carbon-buddy-meal-store',
    }
  )
);