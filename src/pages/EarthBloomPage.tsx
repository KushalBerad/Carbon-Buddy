import { Droplets, Flower, Leaf, ShieldCheck, Sparkles, Sprout, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
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

export const EarthBloomPage = React.memo(function EarthBloomPage({
  profile: propProfile,
  onEarnPoints: propOnEarnPoints,
  adoptedMealsCount: propAdoptedMealsCount,
  completedHabitsCount: propCompletedHabitsCount,
}: EarthBloomPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeEarnPoints = useUserStore((s) => s.earnPoints);
  const storeMeals = useMealStore((s) => s.meals);
  const storeHabits = useHabitStore((s) => s.habits);
  const storeBloomMessage = useBloomStore((s) => s.bloomMessage);
  const storeSetBloomMessage = useBloomStore((s) => s.setBloomMessage);

  const profile = propProfile || storeProfile;
  const onEarnPoints = propOnEarnPoints || storeEarnPoints;
  const adoptedMealsCount = propAdoptedMealsCount !== undefined ? propAdoptedMealsCount : storeMeals.filter(m => m.adopted).length;
  const completedHabitsCount = propCompletedHabitsCount !== undefined ? propCompletedHabitsCount : storeHabits.filter(h => h.checked).length;

  const [watering, setWatering] = useState(false);
  const [sunning, setSunning] = useState(false);
  const [composting, setComposting] = useState(false);
  const [growthState, setGrowthState] = useState<number>(0); // 0 to 100 level representation of current plant stage
  const [activeSpeciesIndex, setActiveSpeciesIndex] = useState(0);
  const [bloomMessage, setBloomMessage] = [storeBloomMessage, storeSetBloomMessage];

  if (!profile) return null;

  const speciesList: PlantSpec[] = [
    { id: 'p1', name: 'Climbing Ivy', requiredXP: 0, description: 'Cleanses nearby digital air and grows under modest conditions.', color: 'text-emerald-500', glowColor: 'rgba(16, 185, 129, 0.2)' },
    { id: 'p2', name: 'Bonsai Birch', requiredXP: 150, description: 'Sturdy carbon sequestration species. Grows heavy wooden knots.', color: 'text-teal-600', glowColor: 'rgba(13, 148, 136, 0.2)' },
    { id: 'p3', name: 'Wild Orchid', requiredXP: 300, description: 'Exotic flora responsive to zero-waste schedules.', color: 'text-fuchsia-500', glowColor: 'rgba(217, 70, 239, 0.2)' },
    { id: 'p4', name: 'Golden Bamboo', requiredXP: 500, description: 'Rapidly grows shoots with maximum solar efficiency.', color: 'text-amber-500', glowColor: 'rgba(245, 158, 11, 0.2)' },
  ];

  // Calculate current plant progress relative to the active species requirement
  const score = profile.points;
  const currentLevelXP = profile.points % 250;
  const growthPercentage = Math.min(100, Math.round((currentLevelXP / 250) * 100));

  // Determine stage description based on points
  const getStageName = () => {
    if (score < 50) return { stage: 'Seed', description: 'Your journey starts here. Fully dependent on your low-carbon commuting habits.' };
    if (score < 100) return { stage: 'Sprout', description: 'Beginning to unfurl. Powered by your green choice baselines.' };
    if (score < 150) return { stage: 'Young Plant', description: 'Expanding leaf spans. Continual green choices strengthen the core stem.' };
    if (score < 200) return { stage: 'Healthy Plant', description: 'Robust, vibrant growth. Shows consistent daily sustainability check-ins.' };
    if (score < 250) return { stage: 'Small Tree', description: 'A sturdy woody stem emerges. Great energy conservation habits!' };
    if (score < 305) return { stage: 'Blooming Tree', description: 'Beautiful petals are emerging, celebrating your adopted plant meal alternatives.' };
    if (score < 350) return { stage: 'Growing Tree', description: 'Branch density is increasing, capturing carbon from your commute offsets.' };
    if (score < 400) return { stage: 'Mini Ecosystem', description: 'Attracting regional bio-diversity as your green streak milestones pile up.' };
    if (score < 480) return { stage: 'Garden', description: 'A beautiful community landmark of active zero-waste lifestyle choices.' };
    return { stage: 'Thriving Forest', description: 'An ultimate sanctuary of life. You are a carbon-neutral pioneer force!' };
  };

  const currentStage = getStageName();

  const handleWater = () => {
    if (watering) return;
    setWatering(true);
    setBloomMessage('You watered your plant! Sparking leaf hydration...');
    setTimeout(() => {
      setWatering(false);
      setBloomMessage('Thirst quenched! Your plant absorbed the water beautifully (Visual only - growth is driven solely by your real achievements).');
    }, 1500);
  };

  const handleSunlight = () => {
    if (sunning) return;
    setSunning(true);
    setBloomMessage('Bathing the leaves in high-intensity solar waves...');
    setTimeout(() => {
      setSunning(false);
      setBloomMessage('Photosynthesis complete! Energy levels maximized (Visual only - points must be earned through real actions).');
    }, 1500);
  };

  const handleCompost = () => {
    if (composting) return;
    setComposting(true);
    setBloomMessage('Injecting zero-waste organic compost into the root systems...');
    setTimeout(() => {
      setComposting(false);
      setBloomMessage('Soil nutrition optimized beautifully (Visual only - plant maturity scales with your active Carbon Buddy achievements).');
    }, 1500);
  };

  const activeSpecies = speciesList[activeSpeciesIndex];

  // Auto unlock plant species based on current points
  useEffect(() => {
    let unlockedIdx = 0;
    for (let i = speciesList.length - 1; i >= 0; i--) {
      if (profile.points >= speciesList[i].requiredXP) {
        unlockedIdx = i;
        break;
      }
    }
    setActiveSpeciesIndex(unlockedIdx);
  }, [profile.points]);

  return (
    <div className="space-y-8 font-sans" id="earth-bloom-section">
      
      {/* Header section */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Flower className="w-6.5 h-6.5 text-emerald-500 animate-pulse" />
          Earth Bloom Planter
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
          Nurture your virtual terrarium. Your positive carbon offsets, meal choices, and green streaks directly feed this living botanical ecosystem.
        </p>
      </div>

      {/* Grid containing Interactive graphic and controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Plant Display Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card 
            className="p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px] bg-gradient-to-b from-emerald-50/10 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-950/80 border border-zinc-200/60 dark:border-zinc-850"
            style={{ boxShadow: `0 20px 40px ${activeSpecies.glowColor}` }}
          >
            {/* Dynamic floating sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <AnimatePresence>
                {watering && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.8, y: 150 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeIn' }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col gap-4 text-sky-400"
                  >
                    <Droplets className="w-5 h-5 animate-bounce" />
                    <Droplets className="w-4 h-4 translate-x-4" />
                    <Droplets className="w-4.5 h-4.5 -translate-x-6" />
                  </motion.div>
                )}
                {sunning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 0.4, 0.4, 0], scale: [0.6, 1.2, 1.2, 0.6] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-yellow-400/5 pointer-events-none"
                  >
                    <Sun className="w-48 h-48 text-yellow-400/20 animate-spin" style={{ animationDuration: '8s' }} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute top-12 right-12 text-teal-400 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="absolute bottom-24 left-10 text-emerald-400/80 animate-bounce" style={{ animationDuration: '3s' }}>
                <Leaf className="w-3 h-3" />
              </div>
            </div>

            {/* Current Plant species badge in top right */}
            <div className="absolute top-4 left-4 p-2 px-3 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-250/20 flex items-center gap-1.5 text-[10px] font-bold font-mono">
              <Sprout className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activeSpecies.name}</span>
            </div>

            <div className="absolute top-4 right-4 p-2 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold font-mono">
              Level {profile.level} • {currentStage.stage}
            </div>

            {/* SVG Interactive Planter Visual */}
            <div className="w-64 h-64 flex items-end justify-center relative mt-6">
              
              {/* Dynamic Soil / Pot Container */}
              <div className="absolute bottom-0 w-36 h-10 bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-850 dark:to-zinc-900 rounded-b-xl border-t-4 border-emerald-800 shadow-lg flex flex-col items-center justify-center">
                <span className="text-[8px] tracking-widest text-zinc-500 dark:text-zinc-300 font-mono uppercase font-black">TERRA CO₂ BASE</span>
              </div>

              {/* Trunk and leaves drawn dynamically inside SVG based on score */}
              <svg className="w-56 h-56 z-10 select-none pb-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Main Stem trunk growing taller and branching out higher with points */}
                
                {/* Leaves unfolding based on user points milestone checkpoints */}
                {score >= 20 && (
                  <motion.path
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    d="M 50 75 Q 40 70 42 66 Q 50 71 50 75"
                    fill="#10B981"
                    className="animate-pulse"
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

                {score >= 120 && (
                  <motion.g id="sapling-foliage">
                    <circle cx="34" cy="38" r="4" fill="#34D399" />
                    <circle cx="62" cy="30" r="5" fill="#10B981" />
                  </motion.g>
                )}

                {score >= 250 && (
                  <motion.g id="flowering-canopy" className="origin-center animate-bounce" style={{ animationDuration: '4s' }}>
                    {/* Floating pink flowers on fuchsia/teal species triggers */}
                    <circle cx="27" cy="28" r="6" fill="#F43F5E" />
                    <circle cx="73" cy="17" r="7" fill="#F43F5E" />
                    {/* Little yellow stamen dots */}
                    <circle cx="27" cy="28" r="2" fill="#FBBF24" />
                    <circle cx="73" cy="17" r="2" fill="#FBBF24" />
                  </motion.g>
                )}

                {score >= 400 && (
                  <motion.g id="golden-oracle-wings">
                    <circle cx="48" cy="18" r="8" fill="#FBBF24" className="opacity-80 animate-pulse" />
                    <path d="M 48 18 L 48 8 M 48 18 L 38 18 M 48 18 L 58 18" stroke="#FBBF24" strokeWidth="1" />
                  </motion.g>
                )}
              </svg>

              {/* Live bloom multipliers based on completion state */}
              <div className="absolute bottom-12 flex items-center justify-center gap-1 bg-zinc-900/85 backdrop-blur-md text-white rounded-full p-2 px-3 border border-zinc-800 text-[10px] font-mono shadow-xl z-20">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Adopted: <strong className="text-emerald-400">{adoptedMealsCount} meals</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Habits: <strong className="text-teal-400">{completedHabitsCount} log</strong></span>
              </div>
            </div>

            {/* Bottom Status feedback display */}
            <div className="w-full text-center mt-5 p-3 bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/40 dark:border-zinc-850/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{bloomMessage}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light">{activeSpecies.description}</p>
            </div>
          </Card>
        </div>

        {/* Nurturing Dashboard Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-5 space-y-4">
            <div className="pb-3 border-b border-zinc-150 dark:border-zinc-800 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Planter Interactions</h2>
            </div>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
              Interact with your plant to trigger high-fidelity visual simulations! Manual interactions do not award XP. True ecosystem growth is powered strictly by completing real sustainable behaviors across Carbon Buddy modules.
            </p>

            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                className="w-full flex justify-between items-center py-3 bg-sky-500/10 hover:bg-sky-500/15 text-sky-600 border border-sky-500/20 rounded-xl transition-all"
                onClick={handleWater}
                isLoading={watering}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>Nurture: Hydrate Plant</span>
                </div>
                <span className="text-[10px] font-mono text-sky-450 dark:text-sky-500/80 font-bold uppercase tracking-wider">Aesthetic Effect</span>
              </Button>

              <Button
                variant="primary"
                className="w-full flex justify-between items-center py-3 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded-xl transition-all"
                onClick={handleSunlight}
                isLoading={sunning}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Sun className="w-4.5 h-4.5 text-amber-500" />
                  <span>Nurture: Solar Radiation</span>
                </div>
                <span className="text-[10px] font-mono text-amber-450 dark:text-amber-500/80 font-bold uppercase tracking-wider">Aesthetic Effect</span>
              </Button>

              <Button
                variant="primary"
                className="w-full flex justify-between items-center py-3 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 rounded-xl transition-all"
                onClick={handleCompost}
                isLoading={composting}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Nurture: Add Organic Compost</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-450 dark:text-emerald-500/80 font-bold uppercase tracking-wider">Aesthetic Effect</span>
              </Button>
            </div>
          </Card>

          {/* Species directory */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-550">Terrarium Milestones</h3>
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {speciesList.map((spec, idx) => {
                const isUnlocked = score >= spec.requiredXP;
                return (
                  <div 
                    key={spec.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      isUnlocked 
                        ? 'bg-zinc-50 dark:bg-zinc-950 border-emerald-500/30' 
                        : 'bg-zinc-100/30 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-850 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isUnlocked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>
                        {isUnlocked ? <Flower className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`font-bold ${isUnlocked ? 'text-zinc-800 dark:text-zinc-150' : 'text-zinc-500'}`}>{spec.name}</p>
                        <p className="text-[10px] text-zinc-500 font-light truncate max-w-[200px]">{spec.description}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-500">
                      {isUnlocked ? 'Unlocked' : `${spec.requiredXP} XP`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
});

