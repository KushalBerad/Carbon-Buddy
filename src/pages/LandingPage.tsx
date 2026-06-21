import {
  ArrowRight,
  Flame,
  Leaf,
  Target,
  Zap,
} from 'lucide-react';
import React, { useCallback } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';

export interface LandingPageProps {
  onStartOnboarding?: () => void;
  onSkipToDashboard?: () => void;
}

export const LandingPage = React.memo(
  function LandingPage({
    onStartOnboarding: propOnStartOnboarding,
    onSkipToDashboard: propOnSkipToDashboard,
  }: LandingPageProps) {
    const setCurrentView = useUserStore(
      (s) => s.setCurrentView
    );

    const setProfile = useUserStore(
      (s) => s.setProfile
    );

    const startOnboarding =
      propOnStartOnboarding ??
      (() => setCurrentView('onboarding'));

    const skipDashboard = useCallback(() => {
      if (propOnSkipToDashboard) {
        propOnSkipToDashboard();
        return;
      }

      setProfile({
        name: 'Eco Pioneer',
        dietPreference: 'omnivore',
        commuteMode: 'hybrid',
        energyAwareness: 'medium',
        level: 1,
        points: 100,
        streak: 1,
        carbonSavedTotal: 0,
        moneySavedTotal: 0,
      });

      setCurrentView('dashboard');
    }, [
      propOnSkipToDashboard,
      setProfile,
      setCurrentView,
    ]);

    return (
      <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 pb-16 pt-8 font-sans transition-colors duration-300 dark:bg-zinc-950">

        {/* reduced paint cost */}

        <div className="pointer-events-none absolute left-1/4 top-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="z-10 mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-12 px-4 pt-10 sm:px-6 lg:px-8">

          {/* brand */}

          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <Leaf className="h-3 w-3" />
              <span>Carbon Buddy v1.2</span>
            </div>
          </div>

          {/* hero */}

          <div className="max-w-3xl space-y-5 text-center">

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Live Sustainably
              <br />

              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                Powered by AI
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-zinc-500 dark:text-zinc-300 sm:text-lg">
              Track carbon metrics in real time,
              build sustainable habits, receive
              intelligent recommendations and
              create measurable environmental impact.
            </p>
          </div>

          {/* hero image */}

          <div className="aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200/50 shadow-xl dark:border-zinc-800">

            <img
              src="/hero.jpg"
              alt="Sustainable living landscape"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />

            {/* if image huge → compress manually */}
          </div>

          {/* CTA */}

          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">

            <Button
              variant="accent"
              size="lg"
              rightIcon={
                <ArrowRight className="h-5 w-5" />
              }
              onClick={startOnboarding}
              className="w-full px-8 sm:w-auto"
            >
              Personalize Experience
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={skipDashboard}
              className="w-full px-8 sm:w-auto"
            >
              Go To Dashboard
            </Button>
          </div>

          {/* features */}

          <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">

            <Card className="flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Flame className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Daily Streak Engine
              </h3>

              <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Earn streak rewards for maintaining sustainable daily behavior patterns.
              </p>
            </Card>

            <Card className="flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Zap className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                AI Coach System
              </h3>

              <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Personalized recommendations for meals, commuting and energy optimization.
              </p>
            </Card>

            <Card className="flex flex-col gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <Target className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Weekly Analytics
              </h3>

              <p className="text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-300">
                Review long term environmental impact and improve sustainability decisions.
              </p>
            </Card>
          </div>
        </div>

        {/* footer */}

        <footer className="mt-12 w-full border-t border-zinc-200/40 pt-8 text-center font-mono text-[11px] text-zinc-500 dark:border-zinc-900 dark:text-zinc-300">
          Carbon Buddy — Sustainable living powered by intelligent decision making.
        </footer>
      </div>
    );
  }
);