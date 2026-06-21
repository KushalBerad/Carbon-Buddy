import {
  Droplets,
  Flower,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBloomStore } from '../store/bloomStore';
import { useHabitStore } from '../store/habitStore';
import { useMealStore } from '../store/mealStore';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface EarthBloomPageProps {
  profile?: UserProfile;
  onEarnPoints?: (pts: number, carbonOffset: number) => void;
  adoptedMealsCount?: number;
  completedHabitsCount?: number;
}

interface PlantSpec {
  id: string;
  name: string;
  requiredXP: number;
  description: string;
  color: string;
  glowColor: string;
}

const SPECIES_LIST: PlantSpec[] = [
  {
    id: 'p1',
    name: 'Climbing Ivy',
    requiredXP: 0,
    description:
      'Cleanses nearby digital air and grows under modest conditions.',
    color: 'text-emerald-500',
    glowColor: 'rgba(16,185,129,0.20)',
  },
  {
    id: 'p2',
    name: 'Bonsai Birch',
    requiredXP: 150,
    description:
      'Sturdy carbon sequestration species. Grows heavy wooden knots.',
    color: 'text-teal-600',
    glowColor: 'rgba(13,148,136,0.20)',
  },
  {
    id: 'p3',
    name: 'Wild Orchid',
    requiredXP: 300,
    description:
      'Exotic flora responsive to zero-waste schedules.',
    color: 'text-fuchsia-500',
    glowColor: 'rgba(217,70,239,0.20)',
  },
  {
    id: 'p4',
    name: 'Golden Bamboo',
    requiredXP: 500,
    description:
      'Rapidly grows shoots with maximum solar efficiency.',
    color: 'text-amber-500',
    glowColor: 'rgba(245,158,11,0.20)',
  },
];

export const EarthBloomPage = React.memo(function EarthBloomPage({
  profile: propProfile,
  onEarnPoints: propOnEarnPoints,
  adoptedMealsCount: propAdoptedMealsCount,
  completedHabitsCount: propCompletedHabitsCount,
}: EarthBloomPageProps) {
  const timers = React.useRef<number[]>([]);
  const storeProfile = useUserStore((state) => state.profile);
  const storeEarnPoints = useUserStore((state) => state.earnPoints);

  const storeMeals = useMealStore((state) => state.meals);
  const storeHabits = useHabitStore((state) => state.habits);

  const bloomMessage = useBloomStore((state) => state.bloomMessage);
  const setBloomMessage = useBloomStore(
    (state) => state.setBloomMessage
  );

  const profile = propProfile ?? storeProfile;
  const onEarnPoints = propOnEarnPoints ?? storeEarnPoints;

  const adoptedMealsCount =
    propAdoptedMealsCount ??
    storeMeals.filter((meal) => meal.adopted).length;

  const completedHabitsCount =
    propCompletedHabitsCount ??
    storeHabits.filter((habit) => habit.checked).length;

  const [watering, setWatering] = useState(false);
  const [sunning, setSunning] = useState(false);
  const [composting, setComposting] = useState(false);

  const [activeSpeciesIndex, setActiveSpeciesIndex] =
    useState(0);

  if (!profile) {
    return null;
  }

  const score = profile.points;

  const currentLevelXP = profile.points % 250;

  const growthPercentage = useMemo(() => {
    return Math.min(
      100,
      Math.round((currentLevelXP / 250) * 100)
    );
  }, [currentLevelXP]);

  const currentStage = useMemo(() => {
    if (score < 50) {
      return {
        stage: 'Seed',
        description:
          'Your journey starts here. Growth begins with sustainable actions.',
      };
    }

    if (score < 100) {
      return {
        stage: 'Sprout',
        description:
          'Beginning to unfurl. Your eco habits are building momentum.',
      };
    }

    if (score < 150) {
      return {
        stage: 'Young Plant',
        description:
          'Healthy development supported by your green choices.',
      };
    }

    if (score < 200) {
      return {
        stage: 'Healthy Plant',
        description:
          'Consistent sustainable behavior is strengthening growth.',
      };
    }

    if (score < 250) {
      return {
        stage: 'Small Tree',
        description:
          'Your plant is maturing through consistent impact.',
      };
    }

    if (score < 350) {
      return {
        stage: 'Blooming Tree',
        description:
          'Major growth milestone unlocked through sustainable living.',
      };
    }

    if (score < 450) {
      return {
        stage: 'Mini Ecosystem',
        description:
          'Your sustainability habits are creating ecosystem impact.',
      };
    }

    return {
      stage: 'Thriving Forest',
      description:
        'Maximum growth achieved. You are a carbon-positive pioneer.',
    };
  }, [score]);

  const activeSpecies = SPECIES_LIST[activeSpeciesIndex];

  useEffect(() => {
    let unlockedIndex = 0;

    for (let i = SPECIES_LIST.length - 1; i >= 0; i -= 1) {
      if (profile.points >= SPECIES_LIST[i].requiredXP) {
        unlockedIndex = i;
        break;
      }
    }

    setActiveSpeciesIndex(unlockedIndex);
  }, [profile.points]);

  const handleWater = useCallback(() => {
    if (watering) return;

    setWatering(true);
    setBloomMessage(
      'You watered the plant. Hydration sequence activated.'
    );

    window.setTimeout(() => {
      setWatering(false);
      setBloomMessage(
        'Water absorbed successfully. Visual interaction complete.'
      );
    }, 1500);
  }, [watering, setBloomMessage]);

  const handleSunlight = useCallback(() => {
    if (sunning) return;

    setSunning(true);
    setBloomMessage(
      'Solar energy exposure initiated.'
    );

    window.setTimeout(() => {
      setSunning(false);
      setBloomMessage(
        'Photosynthesis cycle completed successfully.'
      );
    }, 1500);
  }, [sunning, setBloomMessage]);

  const handleCompost = useCallback(() => {
    if (composting) return;

    setComposting(true);
    setBloomMessage(
      'Organic nutrients delivered to root system.'
    );

    window.setTimeout(() => {
      setComposting(false);
      setBloomMessage(
        'Soil nutrition cycle completed successfully.'
      );
    }, 1500);
  }, [composting, setBloomMessage]);

  return (
    <div
      id="earth-bloom-section"
      className="space-y-8 font-sans"
    >
      <div className="border-b border-zinc-200/50 pb-5 dark:border-zinc-800">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          <Flower className="h-6 w-6 animate-pulse text-emerald-500" />
          Earth Bloom Planter
        </h1>

        <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
          Nurture your virtual ecosystem. Real sustainable actions power plant growth.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Card
            className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden border border-zinc-200/60 bg-gradient-to-b from-emerald-50/10 to-zinc-100/50 p-6 dark:border-zinc-800 dark:from-zinc-900/30 dark:to-zinc-950/80"
            style={{
              boxShadow: `0 20px 40px ${activeSpecies.glowColor}`,
            }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <AnimatePresence>
                {watering && (
                  <motion.div
                    key="water-animation"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.8, y: 150 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeIn',
                    }}
                    className="absolute left-1/2 top-10 flex -translate-x-1/2 flex-col gap-4 text-sky-400"
                  >
                    <Droplets className="h-5 w-5 animate-bounce" />
                    <Droplets className="h-4 w-4 translate-x-4" />
                    <Droplets className="h-4 w-4 -translate-x-4" />
                  </motion.div>
                )}

                {sunning && (
                  <motion.div
                  key="sun-animation"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 0.4, 0.4, 0],
                      scale: [0.6, 1.2, 1.2, 0.6],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-yellow-400/5"
                  >
                    <Sun
                      className="h-48 w-48 animate-spin text-yellow-400/20"
                      style={{ animationDuration: '8s' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute right-12 top-12 animate-pulse text-teal-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="absolute left-4 top-4 rounded-full border border-zinc-200/20 bg-zinc-900/5 px-3 py-2 text-[10px] font-bold">
              <div className="flex items-center gap-1">
                <Sprout className="h-3 w-3 text-emerald-500" />
                <span>{activeSpecies.name}</span>
              </div>
            </div>

            <div className="absolute right-4 top-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] font-bold text-emerald-600">
              Level {profile.level} • {currentStage.stage}
            </div>

            <div className="relative mt-6 flex h-64 w-64 items-end justify-center">
              <div className="absolute bottom-0 flex h-10 w-36 items-center justify-center rounded-b-xl border-t-4 border-emerald-800 bg-gradient-to-r from-zinc-700 to-zinc-800 shadow-lg">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
                  Terra CO₂ Base
                </span>
              </div>

              <svg
                className="z-10 h-56 w-56 select-none pb-4"
                viewBox="0 0 100 100"
                aria-label="Plant growth visualization"
              >
                <line
                  x1="50"
                  y1="90"
                  x2="50"
                  y2="40"
                  stroke="#16A34A"
                  strokeWidth="3"
                />

                {score >= 20 && (
                  <motion.path
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    d="M 50 75 Q 40 70 42 66 Q 50 71 50 75"
                    fill="#10B981"
                  />
                )}

                {score >= 60 && (
                  <motion.path
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    d="M 48 55 Q 58 50 56 46 Q 48 51 48 55"
                    fill="#059669"
                  />
                )}

                {score >= 150 && (
                  <>
                    <circle
                      cx="34"
                      cy="38"
                      r="4"
                      fill="#34D399"
                    />
                    <circle
                      cx="62"
                      cy="30"
                      r="5"
                      fill="#10B981"
                    />
                  </>
                )}

                {score >= 250 && (
                  <>
                    <circle
                      cx="27"
                      cy="28"
                      r="6"
                      fill="#F43F5E"
                    />
                    <circle
                      cx="73"
                      cy="17"
                      r="7"
                      fill="#F43F5E"
                    />
                  </>
                )}

                {score >= 400 && (
                  <>
                    <circle
                      cx="48"
                      cy="18"
                      r="8"
                      fill="#FBBF24"
                    />
                  </>
                )}
              </svg>

              <div className="absolute bottom-12 z-20 rounded-full border border-zinc-800 bg-zinc-900/85 px-3 py-2 text-[10px] text-white backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span>
                    Meals:
                    <strong className="ml-1 text-emerald-400">
                      {adoptedMealsCount}
                    </strong>
                  </span>

                  <span>|</span>

                  <span>
                    Habits:
                    <strong className="ml-1 text-teal-400">
                      {completedHabitsCount}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 w-full rounded-xl border border-zinc-200/40 bg-zinc-900/5 p-3 text-center dark:border-zinc-800/50 dark:bg-white/5">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {bloomMessage}
              </p>

              <p className="mt-1 text-[10px] font-light text-zinc-500 dark:text-zinc-300">
                {activeSpecies.description}
              </p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <Card className="space-y-4 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest">
              Plant Interactions
            </h2>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleWater}
                disabled={watering}
                aria-label="Water plant"
                className="w-full"
              >
                <Droplets className="mr-2 h-4 w-4" />
                Hydrate Plant
              </Button>

              <Button
                variant="primary"
                onClick={handleSunlight}
                disabled={sunning}
                aria-label="Give sunlight"
                className="w-full"
              >
                <Sun className="mr-2 h-4 w-4" />
                Solar Exposure
              </Button>

              <Button
                variant="primary"
                onClick={handleCompost}
                disabled={composting}
                aria-label="Add compost"
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Organic Compost
              </Button>
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Growth Milestones
            </h3>

            <div className="space-y-2">
              {SPECIES_LIST.map((species) => {
                const unlocked =
                  score >= species.requiredXP;

                return (
                  <div
                    key={species.id}
                    className={`rounded-xl border p-3 ${unlocked
                      ? 'border-emerald-500/30 bg-zinc-50 dark:bg-zinc-950'
                      : 'border-zinc-200 bg-zinc-100/20 opacity-60 dark:border-zinc-800'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {unlocked ? (
                          <Flower className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 text-zinc-500" />
                        )}

                        <span className="text-xs font-semibold">
                          {species.name}
                        </span>
                      </div>

                      <span className="text-[10px] text-zinc-500">
                        {unlocked
                          ? 'Unlocked'
                          : `${species.requiredXP} XP`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <div className="mb-1 flex justify-between text-[11px]">
                <span>Growth Progress</span>
                <span>{growthPercentage}%</span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{
                    width: `${growthPercentage}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});