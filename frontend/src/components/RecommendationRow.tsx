import { Clock, Calendar } from 'lucide-react';
import { RecommendationItem } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface RecommendationRowProps {
  item: RecommendationItem;
  onViewRationale?: (item: RecommendationItem) => void;
  onViewTimeline?: (item: RecommendationItem) => void;
}

export const RecommendationRow: React.FC<RecommendationRowProps> = ({
  item,
  onViewRationale,
  onViewTimeline,
}) => {
  return (
    <div className="bg-surface border border-surface-border rounded-xl p-4 hover:border-zinc-700 hover:bg-surface-elevated transition-all space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-semibold text-white tracking-tight">
              {item.skill_name}
            </span>
            <PriorityBadge tier={item.priority_tier} />
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-hover text-zinc-300 border border-surface-border">
              {item.action_type}
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {item.suggested_milestone}
          </p>
        </div>

        <div className="text-right shrink-0">
          {onViewTimeline ? (
            <button
              type="button"
              onClick={() => onViewTimeline(item)}
              title="Click to view full learning timeline roadmap breakdown"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition-all shadow-sm group"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>~{item.estimated_hours} hrs</span>
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded ml-1">
                Timeline
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 bg-surface-elevated px-2.5 py-1 rounded-md border border-surface-border">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>~{item.estimated_hours} hrs</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-zinc-400">
        <span className="truncate max-w-md italic">
          "{item.why_text}"
        </span>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {onViewTimeline && (
            <button
              type="button"
              onClick={() => onViewTimeline(item)}
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          )}

          {onViewRationale && (
            <button
              type="button"
              onClick={() => onViewRationale(item)}
              className="text-accent hover:text-accent-hover font-medium underline underline-offset-4 transition-colors"
            >
              Formula breakdown
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
