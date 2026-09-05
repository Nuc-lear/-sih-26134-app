import React from 'react';
import { cn } from '../lib/utils';
import { PriorityTier, GapTier } from '../types';

interface PriorityBadgeProps {
  tier: PriorityTier;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ tier, className }) => {
  const styles: Record<PriorityTier, string> = {
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    Low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono',
        styles[tier] || styles.Low,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {tier}
    </span>
  );
};

interface GapBadgeProps {
  tier: GapTier;
  className?: string;
}

export const GapBadge: React.FC<GapBadgeProps> = ({ tier, className }) => {
  const styles: Record<GapTier, string> = {
    Strong: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Developing: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    'Major Gap': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Critical Gap': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        styles[tier] || styles.Strong,
        className
      )}
    >
      {tier}
    </span>
  );
};
