import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calculator, ShieldCheck } from 'lucide-react';
import { SkillGapResult, RoleMatchResult, PriorityResult } from '../types';

export type CalculationPayload =
  | { type: 'gap'; data: SkillGapResult }
  | { type: 'match'; data: RoleMatchResult }
  | { type: 'priority'; data: PriorityResult };

interface CalculationModalProps {
  payload: CalculationPayload | null;
  onClose: () => void;
}

export const CalculationModal: React.FC<CalculationModalProps> = ({ payload, onClose }) => {
  if (!payload) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Mathematical Transparency Inspector
              </h3>
              <p className="text-xs text-zinc-400">
                Exact deterministic Python engine formula breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on type */}
        {payload.type === 'gap' && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-surface-elevated border border-surface-border rounded-xl">
              <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider">
                Skill Target
              </span>
              <div className="text-lg font-bold text-white mt-0.5">
                {payload.data.skill_name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="p-3 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-xs text-zinc-400 font-sans block">Required Benchmark</span>
                <span className="text-xl font-bold text-sky-400">{payload.data.required_level}</span>
              </div>
              <div className="p-3 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-xs text-zinc-400 font-sans block">Current Evaluated</span>
                <span className="text-xl font-bold text-emerald-400">{payload.data.student_level}</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-surface-border rounded-xl font-mono text-xs space-y-2">
              <div className="text-zinc-400 font-sans text-xs">Deterministic Python Formula:</div>
              <div className="text-accent font-semibold">
                Gap = max(0, Required_Level - Student_Level)
              </div>
              <div className="text-zinc-200 pt-1 border-t border-zinc-800">
                Gap = max(0, {payload.data.required_level} - {payload.data.student_level}) ={' '}
                <span className="text-rose-400 font-bold">{payload.data.gap} points</span>
              </div>
              <div className="text-zinc-400 pt-1">
                Classification Tier: <span className="text-white font-sans font-medium">{payload.data.tier}</span>
              </div>
            </div>
          </div>
        )}

        {payload.type === 'match' && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-surface-elevated border border-surface-border rounded-xl">
              <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider">
                Role Evaluated
              </span>
              <div className="text-lg font-bold text-white mt-0.5">
                {payload.data.role_title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="p-3 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-xs text-zinc-400 font-sans block">Skill Match Score</span>
                <span className="text-xl font-bold text-sky-400">{payload.data.skill_match_score}%</span>
              </div>
              <div className="p-3 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-xs text-zinc-400 font-sans block">Education Factor</span>
                <span className="text-xl font-bold text-amber-400">×{payload.data.education_factor.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-surface-border rounded-xl font-mono text-xs space-y-2">
              <div className="text-zinc-400 font-sans text-xs">Deterministic Python Formula:</div>
              <div className="text-accent font-semibold">
                Skill Match = Σ(min(student, req) × wt) / Σ(req × wt) × 100
              </div>
              <div className="text-accent font-semibold">
                Final Score = Skill Match Score × Education Factor
              </div>
              <div className="text-zinc-200 pt-2 border-t border-zinc-800 leading-relaxed">
                {payload.data.formula_breakdown}
              </div>
            </div>
          </div>
        )}

        {payload.type === 'priority' && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-surface-elevated border border-surface-border rounded-xl">
              <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider">
                Priority Ranking
              </span>
              <div className="text-lg font-bold text-white mt-0.5">
                {payload.data.skill_name}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2.5 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-[11px] text-zinc-400 font-sans block">Gap</span>
                <span className="text-base font-bold text-rose-400">{payload.data.gap} pts</span>
              </div>
              <div className="p-2.5 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-[11px] text-zinc-400 font-sans block">Demand</span>
                <span className="text-base font-bold text-sky-400">{payload.data.industry_demand.toFixed(1)}/10</span>
              </div>
              <div className="p-2.5 bg-surface-elevated border border-surface-border rounded-lg">
                <span className="text-[11px] text-zinc-400 font-sans block">Importance</span>
                <span className="text-base font-bold text-amber-400">{payload.data.role_importance.toFixed(1)}/10</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-surface-border rounded-xl font-mono text-xs space-y-2">
              <div className="text-zinc-400 font-sans text-xs">Deterministic Python Formula:</div>
              <div className="text-accent font-semibold">
                Priority Score = (Gap / 100) × Demand × Role Importance
              </div>
              <div className="text-zinc-200 pt-1 border-t border-zinc-800">
                {payload.data.formula_breakdown}
              </div>
              <div className="text-zinc-300 font-sans text-xs pt-2 border-t border-zinc-900 leading-relaxed">
                <span className="font-semibold text-white">Dynamic Rationale: </span>
                {payload.data.why_text}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-AI Invariant Enforced</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
