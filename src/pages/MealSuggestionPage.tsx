import {
  CheckCircle2,
  Heart,
  Sparkles,
} from 'lucide-react';
import React, {
  useCallback,
  useState,
} from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useMealStore } from '../store/mealStore';
import { useUserStore } from '../store/userStore';
import {
  MealAlternative,
  UserProfile,
} from '../types';

export interface MealSuggestionPageProps {
  profile?: UserProfile;
  meals?: MealAlternative[];
  onAdoptMeal?: (id: string) => void;
  onGenerateCustomMeal?: (
    baseIngredient: string
  ) => Promise<void>;
  isGeneratingMeal?: boolean;
}

export const MealSuggestionPage = React.memo(
  function MealSuggestionPage({
    profile: propProfile,
    meals: propMeals,
    onAdoptMeal: propOnAdoptMeal,
    onGenerateCustomMeal:
    propOnGenerateCustomMeal,
    isGeneratingMeal:
    propIsGeneratingMeal,
  }: MealSuggestionPageProps) {
    const storeProfile = useUserStore(
      (s) => s.profile
    );

    const storeMeals = useMealStore(
      (s) => s.meals
    );

    const storeAdoptMeal = useMealStore(
      (s) => s.adoptMeal
    );

    const storeGenerateMeal = useMealStore(
      (s) => s.generateCustomMeal
    );

    const storeIsGenerating =
      useMealStore(
        (s) => s.isGeneratingMeal
      );

    const profile =
      propProfile ?? storeProfile;

    const meals = propMeals ?? storeMeals;

    const onAdoptMeal =
      propOnAdoptMeal ??
      storeAdoptMeal;

    const onGenerateCustomMeal =
      propOnGenerateCustomMeal ??
      storeGenerateMeal;

    const isGeneratingMeal =
      propIsGeneratingMeal ??
      storeIsGenerating;

    const [baseInput, setBaseInput] =
      useState('');

    const handleGenerate =
      useCallback(() => {
        if (
          !baseInput.trim() ||
          isGeneratingMeal
        )
          return;

        onGenerateCustomMeal(
          baseInput.trim()
        );

        setBaseInput('');
      }, [
        baseInput,
        isGeneratingMeal,
        onGenerateCustomMeal,
      ]);

    if (!profile) return null;

    return (
      <div className="space-y-8 font-sans">

        {/* Header */}

        <div className="border-b border-zinc-200/50 pb-5 dark:border-zinc-800">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Plant-Based Meal Alternatives
          </h1>

          <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
            Replace high-emission foods
            with sustainable alternatives
            and earn carbon-saving points.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* meal cards */}

          <div className="space-y-4 lg:col-span-2">

            <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
              Active Alternatives Directory
            </h2>

            {meals.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  No meal suggestions available.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {meals.map((meal) => (
                  <Card
                    key={meal.id}
                    className={`relative flex flex-col justify-between gap-6 p-5 transition-all duration-300 md:flex-row md:items-center ${meal.adopted
                        ? 'border border-emerald-500/40 bg-emerald-500/5'
                        : ''
                      }`}
                  >

                    <div className="flex-1 space-y-3">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Carbon Offset:{' '}
                          {
                            meal.carbonOffsetGrams
                          }
                          g
                        </span>

                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Save: $
                          {meal.priceSavedUSD.toFixed(
                            2
                          )}
                        </span>
                      </div>

                      <div className="space-y-1">

                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                          {meal.originalName}
                          {' → '}
                          <strong className="font-medium text-emerald-600 dark:text-emerald-400">
                            {
                              meal.alternativeName
                            }
                          </strong>
                        </h3>

                        <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                          {
                            meal.shortImpactDescription
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                      {meal.adopted ? (
                        <div className="flex items-center gap-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-500">

                          <CheckCircle2 className="h-4 w-4" />

                          <span>
                            Adopted Today
                          </span>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            onAdoptMeal(
                              meal.id
                            )
                          }
                        >
                          Adopt Alternative
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* generator */}

          <div className="space-y-6">

            <Card className="space-y-4 p-5">

              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">

                <Sparkles className="h-4 w-4 text-emerald-500" />

                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
                  AI Meal Planner
                </h3>
              </div>

              <p className="text-[11px] font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Enter any ingredient and let AI
                suggest a lower-carbon
                replacement.
              </p>

              <div className="space-y-3">

                <label
                  htmlFor="meal-input"
                  className="sr-only"
                >
                  Ingredient Input
                </label>

                <input
                  id="meal-input"
                  type="text"
                  placeholder="Example: Lamb chop"
                  value={baseInput}
                  onChange={(e) =>
                    setBaseInput(
                      e.target.value
                    )
                  }
                  disabled={
                    isGeneratingMeal
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />

                <Button
                  variant="accent"
                  size="sm"
                  className="w-full text-xs"
                  onClick={
                    handleGenerate
                  }
                  isLoading={
                    isGeneratingMeal
                  }
                  disabled={
                    !baseInput.trim()
                  }
                >
                  Generate Alternative
                </Button>
              </div>
            </Card>

            {/* info */}

            <Card className="flex gap-3 border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/30">

              <Heart className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />

              <div className="space-y-1">

                <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                  Sustainability & Health
                </h4>

                <p className="text-[10px] font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                  Plant-based meals reduce
                  methane emissions, water
                  consumption, and often improve
                  long-term health metrics.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
);