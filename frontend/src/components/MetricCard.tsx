import React from 'react';
import { cn } from '../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface border border-surface-border rounded-xl p-5 transition-all duration-200',
        onClick && 'cursor-pointer hover:border-surface-hover hover:bg-surface-elevated',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white tracking-tight font-mono">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400">{trend}</span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};
