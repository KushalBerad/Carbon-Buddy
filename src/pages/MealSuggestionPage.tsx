import { CheckCircle2, Heart, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useMealStore } from '../store/mealStore';
import { useUserStore } from '../store/userStore';
import { MealAlternative, UserProfile } from '../types';

export interface MealSuggestionPageProps {
  profile?: UserProfile;
  meals?: MealAlternative[];
  onAdoptMeal?: (id: string) => void;
  onGenerateCustomMeal?: (baseIngredient: string) => Promise<void>;
  isGeneratingMeal?: boolean;
}

export const MealSuggestionPage = React.memo(function MealSuggestionPage({ 
  profile: propProfile, 
  meals: propMeals, 
  onAdoptMeal: propOnAdoptMeal, 
  onGenerateCustomMeal: propOnGenerateCustomMeal, 
  isGeneratingMeal: propIsGeneratingMeal 
}: MealSuggestionPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeMeals = useMealStore((s) => s.meals);
  const storeAdoptMeal = useMealStore((s) => s.adoptMeal);
  const storeGenerateMeal = useMealStore((s) => s.generateCustomMeal);
  const storeIsGenerating = useMealStore((s) => s.isGeneratingMeal);

  const profile = propProfile || storeProfile;
  const meals = propMeals || storeMeals;
  const onAdoptMeal = propOnAdoptMeal || storeAdoptMeal;
  const onGenerateCustomMeal = propOnGenerateCustomMeal || storeGenerateMeal;
  const isGeneratingMeal = propIsGeneratingMeal !== undefined ? propIsGeneratingMeal : storeIsGenerating;

  const [baseInput, setBaseInput] = useState('');

  const handleGenerate = () => {
    if (!baseInput.trim() || isGeneratingMeal) return;
    onGenerateCustomMeal(baseInput.trim());
    setBaseInput('');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Plant-Based Meal Alternatives
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
            Replace high-emission raw beef with eco alternatives and log points instantly.
          </p>
        </div>
      </div>

      {/* Two column splitter for preconfigured and custom generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Meal alternatives cards directory */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Active Alternatives Directory</h2>

          <div className="space-y-4">
            {meals.map((meal) => (
              <Card 
                key={meal.id} 
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 relative ${
                  meal.adopted ? 'border border-emerald-500/50 bg-emerald-500/5' : ''
                }`}
              >
                
                {/* Visual Label Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      Carbon Offset: {meal.carbonOffsetGrams}g
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                      Approx Save: ${meal.priceSavedUSD.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-805 dark:text-zinc-100 font-sans">
                      {meal.originalName} ➔ <strong className="text-emerald-650 dark:text-emerald-400 font-medium">{meal.alternativeName}</strong>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                      {meal.shortImpactDescription}
                    </p>
                  </div>
                </div>

                {/* Adaptive action trigger */}
                <div className="shrink-0 flex items-center gap-2">
                  {meal.adopted ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/10 px-4 py-2.5 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Adopted today</span>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAdoptMeal(meal.id)}
                      aria-label={`Adopt the meal alternative for ${meal.originalName} to ${meal.alternativeName}`}
                    >
                      Adopt Alternative
                    </Button>
                  )}
                </div>

              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic AI Custom Ingredient formulation card */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">AI Meal Alternative Planner</h3>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Have an ingredient in mind you'd like to replace (e.g., ground pork, pork sausage, cheese cream)? Let Gemini suggest a custom alternative:
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="e.g., Premium Lamb chop"
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value)}
                disabled={isGeneratingMeal}
                className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs text-zinc-905 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                aria-label="Enter ingredient to replace"
              />

              <Button
                variant="accent"
                size="sm"
                className="w-full text-xs"
                onClick={handleGenerate}
                isLoading={isGeneratingMeal}
                disabled={!baseInput.trim()}
              >
                Formulate Custom Alternative
              </Button>
            </div>
          </Card>

          {/* Quick tips display */}
          <Card className="p-5 flex gap-2.5 bg-zinc-50 dark:bg-zinc-950/25 border-zinc-150/40 dark:border-zinc-850">
            <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 fill-rose-500/10" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Sustainability and Health</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                Animal-oriented farming creates massive methane and water overheads. Switching just 1 meal per cycle protects global grids and improves cholesterol!
              </p>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
});

