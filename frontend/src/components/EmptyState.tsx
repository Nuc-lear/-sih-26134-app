import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-surface-border rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-zinc-400">
        {icon || <Inbox className="w-6 h-6" />}
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-accent text-zinc-950 hover:bg-accent-hover transition-colors font-sans"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
