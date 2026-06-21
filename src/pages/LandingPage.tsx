import { ArrowRight, Flame, Leaf, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useUserStore } from '../store/userStore';
export interface LandingPageProps {
  onStartOnboarding?: () => void;
  onSkipToDashboard?: () => void;
}

export const LandingPage = React.memo(function LandingPage({ 
  onStartOnboarding: propOnStartOnboarding, 
  onSkipToDashboard: propOnSkipToDashboard 
}: LandingPageProps) {
  const storeSetCurrentView = useUserStore((s) => s.setCurrentView);
  const storeSetProfile = useUserStore((s) => s.setProfile);

  const onStartOnboarding = propOnStartOnboarding || (() => storeSetCurrentView('onboarding'));
  const onSkipToDashboard = propOnSkipToDashboard || (() => {
    storeSetProfile({
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
    storeSetCurrentView('dashboard');
  });

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      
      {/* Decorative top ambient flow blobs */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main hero wrapper */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-12 z-10 pt-10">
        
        {/* Brand Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-widest font-mono"
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Carbon Buddy v1.2</span>
        </motion.div>

        {/* Content Block */}
        <div className="text-center max-w-3xl space-y-5">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight"
          >
            Live Sustainably.<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Empowered by AI.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-zinc-550 dark:text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Track your carbon metrics in real time. Log daily eco-friendly alternatives, generate weekly lifestyle reflections, and interact with a smart AI coach. Built for real sustainable impact.
          </motion.p>
        </div>

        {/* Hero Visual Banner (Generated Artwork) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative w-full max-w-4xl aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800"
        >
          <img 
            src="/hero.jpg"
            alt="Eco-friendly visual landscape representation" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to match mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* CTA Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Button
            variant="accent"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-8"
            aria-label="Start the onboarding process to personalize experience"
          >
            Personalize My Experience
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onSkipToDashboard}
            className="w-full sm:w-auto px-8"
            aria-label="Go directly to the dashboard"
          >
            Go Directly to Dashboard
          </Button>
        </motion.div>

        {/* Bottom Feature Pitch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
          <Card className="p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
              <Flame className="w-5 h-5 fill-orange-500/10" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-150 font-sans">Dynamic Streak Mechanic</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Earn daily multiplication boosts for logging consistent habits. Unlock locked collectible badges for sustainable habits.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <Zap className="w-5 h-5 fill-emerald-500/10" />
            </div>
            <h3 className="text-sm font-bold text-zinc-805 dark:text-zinc-150 font-sans">AI Coach & Meal Plan</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Let the local AI suggest plant-based meal replacements holding lower carbon footprints, with instant cost tracking built in.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-805 dark:text-zinc-150 font-sans">Analytical Reflection</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Analyze lifestyle parameters over weekly cycles. Review structured breakdowns and custom guidance tailored directly for you.
            </p>
          </Card>
        </div>

      </div>

      {/* Footer information */}
      <footer className="w-full text-center mt-12 pt-8 border-t border-zinc-200/40 dark:border-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-300 font-mono">
        Carbon Buddy — Live sustainably, save carbon, and build your green streak.
      </footer>
    </div>
  );
});

