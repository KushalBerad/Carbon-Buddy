import {
  Calendar,
  ChevronRight,
  Hourglass,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useReflectionStore } from '../store/reflectionStore';
import { useUserStore } from '../store/userStore';
import {
  UserProfile,
  WeeklyReflection,
} from '../types';

export interface WeeklyReflectionPageProps {
  profile?: UserProfile;
  reflections?: WeeklyReflection[];
  onGenerateReflection?: () => Promise<void>;
  isGenerating?: boolean;
}

export const WeeklyReflectionPage =
  React.memo(function WeeklyReflectionPage({
    profile: propProfile,
    reflections: propReflections,
    onGenerateReflection:
    propOnGenerateReflection,
    isGenerating: propIsGenerating,
  }: WeeklyReflectionPageProps) {
    const storeProfile =
      useUserStore(
        (s) => s.profile
      );

    const storeReflections =
      useReflectionStore(
        (s) => s.reflections
      );

    const storeGenerateReflection =
      useReflectionStore(
        (s) =>
          s.generateReflection
      );

    const storeIsGenerating =
      useReflectionStore(
        (s) =>
          s.isGeneratingReflection
      );

    const profile =
      propProfile ||
      storeProfile;

    const reflections =
      propReflections ||
      storeReflections;

    const onGenerateReflection =
      propOnGenerateReflection ||
      storeGenerateReflection;

    const isGenerating =
      propIsGenerating !==
        undefined
        ? propIsGenerating
        : storeIsGenerating;

    const [
      selectedReflection,
      setSelectedReflection,
    ] =
      useState<WeeklyReflection | null>(
        reflections.length > 0
          ? reflections[0]
          : null
      );

    useEffect(() => {
      if (
        reflections.length > 0
      ) {
        setSelectedReflection(
          reflections[0]
        );
      } else {
        setSelectedReflection(
          null
        );
      }
    }, [reflections]);

    return (
      <div className="space-y-8 font-sans">

        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-zinc-200/50 pb-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Weekly Lifestyle
              Reflections
            </h1>

            <p className="mt-1 text-xs font-light text-zinc-500 dark:text-zinc-300">
              AI-generated
              sustainability
              analysis based on
              your weekly habits.
            </p>
          </div>

          <Button
            variant="accent"
            leftIcon={
              <Sparkles className="h-4 w-4 text-yellow-300" />
            }
            onClick={
              onGenerateReflection
            }
            isLoading={
              isGenerating
            }
            aria-label="Generate new weekly reflection"
          >
            Generate Reflection
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* History Panel */}

          <div className="space-y-4">

            <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
              Reflection History
            </h2>

            <div className="space-y-3">

              {reflections.length ===
                0 ? (
                <p className="pt-6 text-center text-xs italic font-light text-zinc-500 dark:text-zinc-300">
                  No reflections
                  available yet.
                </p>
              ) : (
                reflections.map(
                  (
                    reflection
                  ) => {
                    const isSelected =
                      selectedReflection?.weekId ===
                      reflection.weekId;

                    return (
                      <button
                        key={reflection.weekId}
                        type="button"
                        onClick={() =>
                          setSelectedReflection(reflection)
                        }
                        aria-current={isSelected ? 'true' : 'false'}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${isSelected
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                          }`}
                      >
                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSelected
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                                }`}
                            >
                              <Calendar className="h-4 w-4" />
                            </div>

                            <div>

                              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                Report{' '}
                                {
                                  reflection.date
                                }
                              </p>

                              <p className="mt-0.5 text-[10px] font-light text-zinc-500 dark:text-zinc-300">
                                Weekly analysis
                              </p>

                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 text-zinc-500" />
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </div>
          {/* Selected Reflection */}

          <div className="lg:col-span-2">

            <AnimatePresence mode="wait">

              {selectedReflection ? (
                <motion.div
                  key={
                    selectedReflection.weekId
                  }
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="space-y-6"
                >
                  <Card className="space-y-6 p-6 sm:p-8">

                    {/* Card Header */}

                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">

                      <div className="space-y-1">

                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                          AI GENERATED REPORT
                        </span>

                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                          Analysis for{' '}
                          {
                            selectedReflection.date
                          }
                        </h3>

                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Star className="h-5 w-5" />
                      </div>

                    </div>

                    {/* Scores */}

                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-3">

                      {[
                        {
                          label:
                            'Diet',
                          val:
                            selectedReflection.dietScore,
                          color:
                            'bg-rose-500/10 text-rose-500',
                        },
                        {
                          label:
                            'Commute',
                          val:
                            selectedReflection.commuteScore,
                          color:
                            'bg-emerald-500/10 text-emerald-500',
                        },
                        {
                          label:
                            'Energy',
                          val:
                            selectedReflection.energyScore,
                          color:
                            'bg-amber-500/10 text-amber-500',
                        },
                      ].map(
                        (
                          item
                        ) => (
                          <div
                            key={
                              item.label
                            }
                            className="space-y-2 text-center"
                          >
                            <span className="text-[10px] font-bold uppercase text-zinc-500">
                              {
                                item.label
                              }
                            </span>

                            <div
                              className={`rounded-xl px-3 py-2 text-xs font-bold ${item.color}`}
                            >
                              {
                                item.val
                              }
                              /100
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* AI Feedback */}

                    <div className="space-y-3">

                      <div className="flex items-center gap-2">

                        <Sparkles className="h-4 w-4 text-emerald-500" />

                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
                          Coaching Directive
                        </h4>

                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">

                        <p className="whitespace-pre-line">
                          {
                            selectedReflection.aiFeedback
                          }
                        </p>

                      </div>

                    </div>

                    {/* Footer */}

                    <div className="flex items-center gap-2 text-[10px] italic text-zinc-500 dark:text-zinc-300">

                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />

                      <span>
                        Verified
                        sustainability
                        report
                        generated
                        securely
                      </span>

                    </div>

                  </Card>
                </motion.div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">

                  <Hourglass
                    className="h-8 w-8 animate-spin text-zinc-500"
                    strokeWidth={
                      1.5
                    }
                  />

                  <p className="mt-3 text-xs font-light text-zinc-500 dark:text-zinc-300">
                    Generate a
                    reflection
                    report to
                    begin
                    analysis.
                  </p>

                </div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  });