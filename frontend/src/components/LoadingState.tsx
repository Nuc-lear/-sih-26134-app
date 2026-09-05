import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingStateProps {
  message: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  submessage,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-surface-border rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white tracking-tight">{message}</h4>
        {submessage ? (
          <p className="text-xs text-zinc-400 leading-relaxed">{submessage}</p>
        ) : (
          <p className="text-xs text-zinc-500 font-mono">Running deterministic pipeline</p>
        )}
      </div>
    </div>
  );
};
