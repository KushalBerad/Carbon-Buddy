import { Calendar, ChevronRight, Hourglass, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useReflectionStore } from '../store/reflectionStore';
import { useUserStore } from '../store/userStore';
import { UserProfile, WeeklyReflection } from '../types';

export interface WeeklyReflectionPageProps {
  profile?: UserProfile;
  reflections?: WeeklyReflection[];
  onGenerateReflection?: () => Promise<void>;
  isGenerating?: boolean;
}

export const WeeklyReflectionPage = React.memo(function WeeklyReflectionPage({ 
  profile: propProfile, 
  reflections: propReflections, 
  onGenerateReflection: propOnGenerateReflection, 
  isGenerating: propIsGenerating 
}: WeeklyReflectionPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeReflections = useReflectionStore((s) => s.reflections);
  const storeGenerateReflection = useReflectionStore((s) => s.generateReflection);
  const storeIsGenerating = useReflectionStore((s) => s.isGeneratingReflection);

  const profile = propProfile || storeProfile;
  const reflections = propReflections || storeReflections;
  const onGenerateReflection = propOnGenerateReflection || storeGenerateReflection;
  const isGenerating = propIsGenerating !== undefined ? propIsGenerating : storeIsGenerating;

  const [selectedReflection, setSelectedReflection] = useState<WeeklyReflection | null>(
    reflections.length > 0 ? reflections[0] : null
  );

  // Auto-select the latest reflection when reflections are added, updated, or reset
  React.useEffect(() => {
    if (reflections.length > 0) {
      setSelectedReflection((prev) => {
        if (!prev) return reflections[0];
        const exists = reflections.some((r) => r.weekId === prev.weekId);
        // If the previously selected item does not exist (e.g. after reset) or if a new one was added at index 0 and list changed
        if (!exists) return reflections[0];
        return prev;
      });
    } else {
      setSelectedReflection(null);
    }
  }, [reflections]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Weekly Lifestyle Reflections
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light mt-1">
            Let Google Gemini analyze your logged offsets to suggest structural lifestyle upgrades.
          </p>
        </div>

        <Button
          variant="accent"
          leftIcon={<Sparkles className="w-4.5 h-4.5 text-yellow-300" />}
          onClick={onGenerateReflection}
          isLoading={isGenerating}
          aria-label="Generate a new weekly reflection report using AI analysis"
        >
          Compute New AI Reflection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Previous Reflections Navigation Rail */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-455 dark:text-zinc-300">Reflections History</h2>

          <div className="space-y-3">
            {reflections.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-300 italic font-light pt-6 text-center">No reports saved yet. Click button above!</p>
            ) : (
              reflections.map((ref) => {
                const isSelected = selectedReflection?.weekId === ref.weekId;
                return (
                  <button
                    key={ref.weekId}
                    onClick={() => setSelectedReflection(ref)}
                    className={`w-full flex items-center justify-between text-left p-4 rounded-2xl border transition-all duration-200 select-none outline-none cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                        : 'border-zinc-150/40 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-90 w-full'
                    }`}
                    aria-label={`View detailed reflection report for week of ${ref.date}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold leading-normal ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          Report {ref.date}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">Lifestyle sector review</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${isSelected ? 'translate-x-0.5 text-emerald-550' : ''}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Reflection Feedback Sheet */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedReflection ? (
              <motion.div
                key={selectedReflection.weekId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card className="p-6 sm:p-8 space-y-6">
                  
                  {/* Card Title */}
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-emerald-555 uppercase font-mono">GOOGLE GEMINI 3.5 ANALYSIS</span>
                      <h3 className="text-lg font-bold text-zinc-855 dark:text-zinc-100 font-sans">Analysis for {selectedReflection.date}</h3>
                    </div>

                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                      <Star className="w-5 h-5 fill-indigo-500/15" />
                    </div>
                  </div>

                  {/* Segment: Dynamic Rating Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-800/80">
                    {[
                      { label: 'Diet Sector', val: selectedReflection.dietScore, color: 'text-rose-500 bg-rose-500/10' },
                      { label: 'Commute Act', val: selectedReflection.commuteScore, color: 'text-emerald-500 bg-emerald-500/10' },
                      { label: 'Energy Load', val: selectedReflection.energyScore, color: 'text-amber-500 bg-amber-500/10' },
                    ].map((sco, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center text-center p-3 space-y-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{sco.label}</span>
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${sco.color}`}>
                          Score: {sco.val}/100
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Output Box */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-extrabold uppercase tracking-widest">Coaching Directive</h4>
                    </div>

                    <div className="text-zinc-650 dark:text-zinc-350 text-xs leading-relaxed font-light space-y-3 bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-850">
                      <p className="whitespace-pre-line">{selectedReflection.aiFeedback}</p>
                    </div>
                  </div>

                  {/* Compliance stamp */}
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-300 font-mono italic">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified carbon reduction report computed server-side</span>
                  </div>

                </Card>
              </motion.div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-zinc-150/40 dark:border-zinc-805 border-dashed rounded-3xl">
                <Hourglass className="w-8 h-8 text-zinc-500 animate-spin" strokeWidth={1.5} />
                <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-3 font-light">
                  Select a historic card or trigger "Compute New AI Reflection" to output a complete analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
});

