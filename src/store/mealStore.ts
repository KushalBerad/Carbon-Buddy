import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MealAlternative } from '../types';
import { useUserStore } from './userStore';

interface MealState {
  meals: MealAlternative[];
  isGeneratingMeal: boolean;
  adoptMeal: (id: string) => void;
  generateCustomMeal: (baseIngredient: string) => Promise<void>;
  resetMeals: () => void;
}

const initialMeals: MealAlternative[] = [
  { id: 'meal-1', originalName: '1/2 lb Beef Burger Patties', alternativeName: 'Lentil & Portobello Mushroom Burger', carbonOffsetGrams: 900, priceSavedUSD: 2.50, shortImpactDescription: 'Beef creates massive methane emissions. Replacing it cuts dinner footprint by 88%.', adopted: false },
  { id: 'meal-2', originalName: 'Full Dairy Milk Carton', alternativeName: 'Organic Oat & Soy Milk mixture', carbonOffsetGrams: 450, priceSavedUSD: 1.20, shortImpactDescription: 'Plant milks have minimal land footprints, cutting emissions in half.', adopted: false },
  { id: 'meal-3', originalName: 'Commercial Pork Sausages', alternativeName: 'Seasoned Chickpea & Garlic Sausage', carbonOffsetGrams: 600, priceSavedUSD: 1.80, shortImpactDescription: 'Pork requires intensive logistics. Chickpea alternatives offer low impact protein.', adopted: false },
];

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      meals: initialMeals,
      isGeneratingMeal: false,
      adoptMeal: (id) => set((state) => {
        const profile = useUserStore.getState().profile;
        const nextMeals = state.meals.map((m) => {
          if (m.id === id) {
            if (profile && !m.adopted) {
              const nextPoints = profile.points + 40;
              const nextLevel = Math.floor(nextPoints / 250) + 1;
              useUserStore.getState().setProfile({
                ...profile,
                points: nextPoints,
                level: nextLevel,
                carbonSavedTotal: profile.carbonSavedTotal + m.carbonOffsetGrams,
                moneySavedTotal: profile.moneySavedTotal + m.priceSavedUSD,
              });
            }
            return { ...m, adopted: true };
          }
          return m;
        });
        return { meals: nextMeals };
      }),
      generateCustomMeal: async (baseIngredient) => {
        set({ isGeneratingMeal: true });
        try {
          const response = await fetch('/api/gemini/meal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredient: baseIngredient }),
          });

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          const formulatedMeal: MealAlternative = {
            id: `meal-custom-${Date.now()}`,
            originalName: baseIngredient,
            alternativeName: data.alternativeName || 'Organic Soybean mixture',
            carbonOffsetGrams: data.carbonOffsetGrams || 500,
            priceSavedUSD: data.priceSavedUSD || 1.50,
            shortImpactDescription: data.shortImpactDescription || 'Vegetal alternatives cut packaging and supply footprints.',
            adopted: false,
          };

          set((state) => ({ meals: [formulatedMeal, ...state.meals] }));
        } catch (error) {
          console.warn('Ingredient formulation fell back to standard simulation:', error);

          const simulatedMeal: MealAlternative = {
            id: `meal-custom-${Date.now()}`,
            originalName: baseIngredient,
            alternativeName: `Premium Roasted Chickpea ${baseIngredient} Substitute`,
            carbonOffsetGrams: 400,
            priceSavedUSD: 1.25,
            shortImpactDescription: 'Grown with minimal tillage. Formulating chickpea swaps cuts emissions by 75%.',
            adopted: false,
          };

          setTimeout(() => {
            set((state) => ({ meals: [simulatedMeal, ...state.meals] }));
          }, 1000);
        } finally {
          set({ isGeneratingMeal: false });
        }
      },
      resetMeals: () => set({ meals: initialMeals, isGeneratingMeal: false }),
    }),
    {
      name: 'carbon-buddy-meal-store',
    }
  )
);
