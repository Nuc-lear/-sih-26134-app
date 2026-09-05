import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Calculator, Target, Compass } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoSuny, isLoading } = useStudent();

  const handleTryDemo = async () => {
    await loadDemoSuny();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto py-12 px-4">
      {/* Top Right Theme Switcher */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-surface-border text-xs text-zinc-300 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>SIH26134 · Team NEXMIND · Controlled Industry Dataset — MVP</span>
      </div>

      {/* Main Hero Typography */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          AI-Powered Career & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            Skill Intelligence Platform
          </span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          We measure where students stand today, compare against structured industry requirements,
          mathematically prioritize what matters most, and use AI solely to explain the result.
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleTryDemo}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover font-semibold text-sm transition-all shadow-xl hover:shadow-accent/25 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Loading Demo...' : 'Try Demo (Suny Ranjan Verma)'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface border border-surface-border hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-sm transition-colors"
        >
          <span>Start Custom Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left w-full">
        <div className="p-4 bg-surface border border-surface-border rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold text-white">Deterministic Scoring</h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Zero AI hallucination. All match percentages and gap values are calculated by pure Python functions.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold text-white">Mathematical Priorities</h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Priorities mathematically weigh deficit magnitude against industry demand and architectural importance.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold text-white">Full Transparency</h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Every metric provides a "How is this calculated?" inspector with the real formula and numbers plugged in.
          </p>
        </div>
      </div>
    </div>
  );
};
