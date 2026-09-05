import React, { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, X, ShieldCheck, Play } from 'lucide-react';

interface TourStep {
  title: string;
  badge: string;
  talkingPoint: string;
  targetAction?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Benchmark Student Loaded',
    badge: 'Step 1/6',
    talkingPoint:
      'Point out Aarav Sharma (B.Tech CS 2nd year) with 9 evaluated skills. Zero login or fake signups required.',
  },
  {
    title: '2. Role Match Score Spread',
    badge: 'Step 2/6',
    talkingPoint:
      'Emphasize the score variance: AI/ML (36.48%), Backend (35.57%), Data Analyst (29.09%), Frontend (16.41%). Proves genuine calculations, not canned 90% mock data.',
  },
  {
    title: '3. Required vs Current Gap Chart',
    badge: 'Step 3/6',
    talkingPoint:
      'Examine the dual-bar chart showing Required Benchmark (sky blue) vs Aarav\'s Current Level (emerald). Hover any bar to see the point delta.',
  },
  {
    title: '4. Mathematical Transparency Affordance',
    badge: 'Step 4/6',
    talkingPoint:
      'Click "How is this calculated?" on any card. Show judges the exact Python formula with real numbers plugged in: Gap = max(0, Required - Current).',
  },
  {
    title: '5. Mathematical Priority Leverage',
    badge: 'Step 5/6',
    talkingPoint:
      'Show why Pandas is #1: (Gap / 100) × Demand (9.5) × Importance (8.5) = 64.60. The "why" rationale is computed dynamically from real numbers.',
  },
  {
    title: '6. The Live Closing Beat (Skill Bump)',
    badge: 'Step 6/6',
    talkingPoint:
      'Click "Live Skill Bump (Judge Test)", bump Machine Learning from 20 to 75, and run re-analysis. Watch the score jump to 45.75% and ML priority plummet in real time!',
  },
];

export const DemoTourBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-elevated border border-accent/40 text-accent hover:bg-surface-hover text-xs font-semibold shadow-2xl transition-all"
      >
        <Sparkles className="w-4 h-4" />
        <span>Open Judge Demo Guide</span>
      </button>
    );
  }

  const step = TOUR_STEPS[currentStepIdx];

  return (
    <div className="bg-surface-elevated border border-accent/30 rounded-2xl p-4 shadow-2xl relative overflow-hidden mb-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Play className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
                {step.badge}
              </span>
              <h4 className="text-xs font-bold text-white tracking-tight">{step.title}</h4>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                Live Demo Mode
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              <span className="font-semibold text-white font-sans">Judge Talking Point: </span>
              {step.talkingPoint}
            </p>
          </div>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg bg-surface border border-surface-border text-zinc-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400">
            {currentStepIdx + 1} / {TOUR_STEPS.length}
          </span>
          <button
            type="button"
            disabled={currentStepIdx === TOUR_STEPS.length - 1}
            onClick={() => setCurrentStepIdx((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))}
            className="p-1.5 rounded-lg bg-surface border border-surface-border text-zinc-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white ml-2 transition-colors"
            title="Minimize guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
