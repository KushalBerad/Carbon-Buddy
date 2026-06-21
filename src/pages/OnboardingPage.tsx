import { ArrowLeft, ArrowRight, Bike, Car, CheckCircle, Compass, Leaf, Utensils } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

export interface OnboardingPageProps {
  onComplete?: (profile: UserProfile) => void;
}

export const OnboardingPage = React.memo(function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const storeSetProfile = useUserStore((s) => s.setProfile);
  const storeSetCurrentView = useUserStore((s) => s.setCurrentView);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [diet, setDiet] = useState('omnivore');
  const [commute, setCommute] = useState('hybrid');
  const [energy, setEnergy] = useState('medium');

  const dietOptions = [
    { value: 'vegan', label: 'Plant-Based / Vegan', desc: 'No animal products. Keeps lowest meal emissions.' },
    { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, includes dairy/eggs. Moderately footprint friendly.' },
    { value: 'omnivore', label: 'Omnivore', desc: 'Include meat and fish alternatives, standard baseline.' },
  ];

  const commuteOptions = [
    { value: 'transit', label: 'Public Transit / Bike', desc: 'Subway, bus, rail or bicycle commuting.' },
    { value: 'hybrid', label: 'Hybrid / Shared Carpool', desc: 'Part electric carpool, part working remote.' },
    { value: 'individual', label: 'Solo Ride Combustion', desc: 'Single-rider petrol vehicle commute.' },
  ];

  const energyOptions = [
    { value: 'high', label: 'Conscious / Smart Home', desc: 'Always unplug continuous phantom power vampire loads.' },
    { value: 'medium', label: 'Standard Householder', desc: 'Average usage, standard heat pump and appliance cycle.' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Complete onboarding and output config profile
      const finalProfile: UserProfile = {
        name: name.trim() || 'Eco Pioneer',
        dietPreference: diet,
        commuteMode: commute,
        energyAwareness: energy,
        level: 1,
        points: 100, // onboarding reward!
        streak: 1,
        carbonSavedTotal: 0,
        moneySavedTotal: 0,
      };
      
      if (onComplete) {
        onComplete(finalProfile);
      } else {
        storeSetProfile(finalProfile);
        storeSetCurrentView('dashboard');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen py-16 flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-8">
        
        {/* Onboarding Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-wide">
              Personal Setup Wizard
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <span>Step {step} of 4</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-emerald-500' : 'bg-zinc-100 dark:bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content blocks with spring transition */}
        <div className="min-h-[220px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">What's your eco-pioneer name?</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                    Choose the moniker you'd like Carbon Buddy's AI coach to address you with.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">Choose your diet baseline</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                    Food represents a massive portion of lifestyle carbon output. Set your common baseline.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {dietOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDiet(opt.value)}
                      className={`w-full flex items-center justify-between text-left p-3.5 rounded-2xl border transition-all duration-200 select-none outline-none cursor-pointer ${
                        diet === opt.value
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 font-semibold shadow-xs'
                          : 'border-zinc-150/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 text-zinc-650 dark:text-zinc-300'
                      }`}
                      aria-label={`Select ${opt.label} as your diet preference`}
                    >
                      <div>
                        <p className="text-xs font-bold leading-normal">{opt.label}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">{opt.desc}</p>
                      </div>
                      <Utensils className={`w-4 h-4 shrink-0 transition-transform ${diet === opt.value ? 'text-emerald-500 scale-110' : 'text-zinc-500'}`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">Your daily commute style</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                    This shapes your starting transport habit multipliers. Choose your normal method.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {commuteOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCommute(opt.value)}
                      className={`w-full flex items-center justify-between text-left p-3.5 rounded-2xl border transition-all duration-200 select-none outline-none cursor-pointer ${
                        commute === opt.value
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 font-semibold shadow-xs'
                          : 'border-zinc-150/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 text-zinc-650 dark:text-zinc-300'
                      }`}
                      aria-label={`Select ${opt.label} as your commute preference`}
                    >
                      <div>
                        <p className="text-xs font-bold leading-normal">{opt.label}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">{opt.desc}</p>
                      </div>
                      {opt.value === 'transit' ? (
                        <Bike className={`w-4 h-4 shrink-0 ${commute === opt.value ? 'text-emerald-500' : 'text-zinc-405'}`} />
                      ) : (
                        <Car className={`w-4 h-4 shrink-0 ${commute === opt.value ? 'text-emerald-500' : 'text-zinc-405'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">Energy & conservation settings</h2>
                  <p className="text-xs text-zinc-455 dark:text-zinc-300 font-light leading-relaxed">
                    How do you manage standard home appliance Vampire/continuous loads?
                  </p>
                </div>
                <div className="space-y-2.5">
                  {energyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEnergy(opt.value)}
                      className={`w-full flex items-center justify-between text-left p-3.5 rounded-2xl border transition-all duration-200 select-none outline-none cursor-pointer ${
                        energy === opt.value
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 font-semibold shadow-xs'
                          : 'border-zinc-150/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 text-zinc-655 dark:text-zinc-300'
                      }`}
                      aria-label={`Select ${opt.label} as your energy conservation preference`}
                    >
                      <div>
                        <p className="text-xs font-bold leading-normal">{opt.label}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">{opt.desc}</p>
                      </div>
                      <Compass className={`w-4 h-4 shrink-0 ${energy === opt.value ? 'text-emerald-500' : 'text-zinc-405'}`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Actions Footer block */}
        <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {step > 1 ? (
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleBack}
              className="flex-1"
              aria-label="Go back to the previous step"
            >
              Back
            </Button>
          ) : (
            <div className="flex-1 invisible" />
          )}

          <Button
            variant="accent"
            rightIcon={step === 4 ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            onClick={handleNext}
            className="flex-1"
            disabled={step === 1 && !name.trim()}
            aria-label={step === 4 ? 'Confirm your onboarding setup' : 'Continue to the next step'}
          >
            {step === 4 ? 'Confirm Setup' : 'Continue'}
          </Button>
        </div>

      </div>
    </div>
  );
});

