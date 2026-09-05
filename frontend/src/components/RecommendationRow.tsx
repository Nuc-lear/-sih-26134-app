import { Clock } from 'lucide-react';
import { RecommendationItem } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface RecommendationRowProps {
  item: RecommendationItem;
  onViewRationale?: (item: RecommendationItem) => void;
}

export const RecommendationRow: React.FC<RecommendationRowProps> = ({
  item,
  onViewRationale,
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
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 bg-surface-elevated px-2.5 py-1 rounded-md border border-surface-border">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>~{item.estimated_hours} hrs</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-zinc-400">
        <span className="truncate max-w-md italic">
          "{item.why_text}"
        </span>

        {onViewRationale && (
          <button
            type="button"
            onClick={() => onViewRationale(item)}
            className="text-accent hover:text-accent-hover font-medium underline underline-offset-4 ml-4 shrink-0 transition-colors"
          >
            Formula breakdown
          </button>
        )}
      </div>
    </div>
  );
};
