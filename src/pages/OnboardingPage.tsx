import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  CheckCircle,
  Compass,
  Leaf,
  Utensils,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, {
  useCallback,
  useState,
} from 'react';
import { Button } from '../components/Button';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface OnboardingPageProps {
  onComplete?: (
    profile: UserProfile
  ) => void;
}

type DietType =
  | 'vegan'
  | 'vegetarian'
  | 'omnivore';

type CommuteType =
  | 'transit'
  | 'hybrid'
  | 'individual';

type EnergyType =
  | 'high'
  | 'medium';

export const OnboardingPage =
  React.memo(function OnboardingPage({
    onComplete,
  }: OnboardingPageProps) {
    const storeSetProfile =
      useUserStore(
        (s) => s.setProfile
      );

    const storeSetCurrentView =
      useUserStore(
        (s) => s.setCurrentView
      );

    const [step, setStep] =
      useState(1);

    const [name, setName] =
      useState('');

    const [diet, setDiet] =
      useState<DietType>(
        'omnivore'
      );

    const [commute, setCommute] =
      useState<CommuteType>(
        'hybrid'
      );

    const [energy, setEnergy] =
      useState<EnergyType>(
        'medium'
      );

    const dietOptions = [
      {
        value: 'vegan',
        label:
          'Plant-Based / Vegan',
        desc:
          'No animal products. Lowest food emissions.',
      },
      {
        value: 'vegetarian',
        label: 'Vegetarian',
        desc:
          'No meat. Includes dairy and eggs.',
      },
      {
        value: 'omnivore',
        label: 'Omnivore',
        desc:
          'Standard mixed diet baseline.',
      },
    ];

    const commuteOptions = [
      {
        value: 'transit',
        label:
          'Public Transit / Bike',
        desc:
          'Bus, metro, train or bicycle.',
      },
      {
        value: 'hybrid',
        label:
          'Hybrid / Carpool',
        desc:
          'Shared commuting and remote work.',
      },
      {
        value: 'individual',
        label:
          'Solo Vehicle',
        desc:
          'Single rider petrol commute.',
      },
    ];

    const energyOptions = [
      {
        value: 'high',
        label:
          'Smart Energy Usage',
        desc:
          'Actively reduce unnecessary energy loads.',
      },
      {
        value: 'medium',
        label:
          'Standard Household',
        desc:
          'Average home appliance usage.',
      },
    ];

    const handleNext =
      useCallback(() => {
        if (step < 4) {
          setStep((prev) =>
            prev + 1
          );
          return;
        }

        const finalProfile: UserProfile =
        {
          name:
            name.trim() ||
            'Eco Pioneer',
          dietPreference: diet,
          commuteMode: commute,
          energyAwareness:
            energy,
          level: 1,
          points: 100,
          streak: 1,
          carbonSavedTotal: 0,
          moneySavedTotal: 0,
        };

        if (onComplete) {
          onComplete(finalProfile);
        } else {
          storeSetProfile(
            finalProfile
          );
          storeSetCurrentView(
            'dashboard'
          );
        }
      }, [
        step,
        name,
        diet,
        commute,
        energy,
        onComplete,
        storeSetProfile,
        storeSetCurrentView,
      ]);

    const handleBack =
      useCallback(() => {
        if (step > 1) {
          setStep((prev) =>
            prev - 1
          );
        }
      }, [step]);

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-zinc-950 sm:px-6 lg:px-8">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

        <div className="z-10 w-full max-w-xl space-y-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Leaf className="h-4 w-4" />
              </div>

              <span className="text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                Personal Setup Wizard
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">

              <span>
                Step {step} of 4
              </span>

              <div className="flex gap-1">
                {[1, 2, 3, 4].map(
                  (s) => (
                    <div
                      key={s}
                      className={`h-1 w-3 rounded-full ${s <= step
                          ? 'bg-emerald-500'
                          : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Content */}

          <div className="flex min-h-[220px] flex-col justify-center">

            <AnimatePresence mode="wait">

              {/* STEP 1 */}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      What should we call you?
                    </h2>

                    <p className="text-xs font-light text-zinc-500 dark:text-zinc-300">
                      Set your Carbon Buddy profile.
                    </p>
                  </div>

                  <label
                    htmlFor="user-name"
                    className="sr-only"
                  >
                    Name
                  </label>

                  <input
                    id="user-name"
                    type="text"
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    autoFocus
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </motion.div>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold">
                    Diet Preference
                  </h2>

                  <div className="space-y-2">

                    {dietOptions.map(
                      (opt) => (
                        <button
                          key={
                            opt.value
                          }
                          type="button"
                          onClick={() =>
                            setDiet(
                              opt.value as DietType
                            )
                          }
                          className={`w-full rounded-2xl border p-3 text-left transition-all ${diet ===
                              opt.value
                              ? 'border-emerald-500 bg-emerald-500/5'
                              : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-xs font-bold">
                                {
                                  opt.label
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-500">
                                {
                                  opt.desc
                                }
                              </p>
                            </div>

                            <Utensils className="h-4 w-4 text-emerald-500" />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold">
                    Commute Style
                  </h2>

                  <div className="space-y-2">

                    {commuteOptions.map(
                      (opt) => (
                        <button
                          key={
                            opt.value
                          }
                          type="button"
                          onClick={() =>
                            setCommute(
                              opt.value as CommuteType
                            )
                          }
                          className={`w-full rounded-2xl border p-3 text-left ${commute ===
                              opt.value
                              ? 'border-emerald-500 bg-emerald-500/5'
                              : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-xs font-bold">
                                {
                                  opt.label
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-500">
                                {
                                  opt.desc
                                }
                              </p>
                            </div>

                            {opt.value ===
                              'transit' ? (
                              <Bike className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Car className="h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold">
                    Energy Awareness
                  </h2>

                  <div className="space-y-2">

                    {energyOptions.map(
                      (opt) => (
                        <button
                          key={
                            opt.value
                          }
                          type="button"
                          onClick={() =>
                            setEnergy(
                              opt.value as EnergyType
                            )
                          }
                          className={`w-full rounded-2xl border p-3 text-left ${energy ===
                              opt.value
                              ? 'border-emerald-500 bg-emerald-500/5'
                              : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-xs font-bold">
                                {
                                  opt.label
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-500">
                                {
                                  opt.desc
                                }
                              </p>
                            </div>

                            <Compass className="h-4 w-4 text-emerald-500" />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}

          <div className="flex items-center gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">

            {step > 1 ? (
              <Button
                variant="secondary"
                leftIcon={
                  <ArrowLeft className="h-4 w-4" />
                }
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
            ) : (
              <div className="flex-1 invisible" />
            )}

            <Button
              variant="accent"
              rightIcon={
                step === 4 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
              onClick={handleNext}
              className="flex-1"
              disabled={
                step === 1 &&
                !name.trim()
              }
            >
              {step === 4
                ? 'Confirm Setup'
                : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    );
  });