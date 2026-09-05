import React from 'react';
import { ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { RoleMatchResult } from '../types';

interface RoleMatchCardProps {
  match: RoleMatchResult;
  isSelected?: boolean;
  onSelect?: (match: RoleMatchResult) => void;
  onViewCalculation?: (match: RoleMatchResult) => void;
}

export const RoleMatchCard: React.FC<RoleMatchCardProps> = ({
  match,
  isSelected = false,
  onSelect,
  onViewCalculation,
}) => {
  const percentage = Math.round(match.final_score);

  // Dynamic progress bar color
  let barColor = 'bg-sky-500';
  if (percentage >= 70) barColor = 'bg-emerald-500';
  else if (percentage >= 40) barColor = 'bg-amber-500';

  return (
    <div
      onClick={() => onSelect?.(match)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(match);
        }
      }}
      className={cn(
        'group relative bg-surface border rounded-xl p-4 transition-all duration-200 cursor-pointer select-none text-left',
        isSelected
          ? 'border-accent bg-surface-elevated ring-2 ring-accent/40 shadow-lg shadow-accent/5'
          : 'border-surface-border hover:border-zinc-700 hover:bg-surface-elevated/70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors truncate">
              {match.role_title}
            </h3>
            {isSelected && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold tracking-wide uppercase border border-accent/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <GraduationCap className="w-3 h-3 text-zinc-500 shrink-0" />
            <span>
              Edu: <span className="font-mono text-zinc-300">×{match.education_factor.toFixed(2)}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span>
              Base: <span className="font-mono text-zinc-300">{Math.round(match.skill_match_score)}%</span>
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className={cn('text-xl font-bold font-mono', isSelected ? 'text-accent' : 'text-white')}>
            {percentage}%
          </div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block -mt-1 font-mono">
            Match
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn('h-full transition-all duration-700 ease-out rounded-full', barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Card actions */}
      <div className="mt-3 pt-2.5 border-t border-surface-border/70 flex items-center justify-between text-xs">
        {onViewCalculation && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewCalculation(match);
            }}
            className="text-[11px] text-zinc-400 hover:text-accent font-medium underline underline-offset-4 decoration-zinc-700 hover:decoration-accent transition-colors"
          >
            How is this calculated?
          </button>
        )}

        <span
          className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium transition-colors ml-auto',
            isSelected ? 'text-accent font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'
          )}
        >
          <span>{isSelected ? 'Active Target' : 'Set Target'}</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
