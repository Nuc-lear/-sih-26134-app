import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Analysis Unavailable',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-rose-500/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-surface-elevated border border-surface-border text-zinc-200 hover:text-white hover:border-zinc-700 transition-colors font-sans"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
