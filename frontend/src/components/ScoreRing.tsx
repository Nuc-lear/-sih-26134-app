import React from 'react';
import { cn } from '../lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Determine accent color based on score magnitude
  let strokeColor = '#38bdf8'; // sky blue
  if (clampedScore >= 75) {
    strokeColor = '#10b981'; // emerald
  } else if (clampedScore >= 45) {
    strokeColor = '#f59e0b'; // amber
  } else if (clampedScore > 0) {
    strokeColor = '#38bdf8'; // slate blue
  } else {
    strokeColor = '#64748b'; // muted
  }

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e2230"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress active circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">
          {Math.round(clampedScore)}
          <span className="text-lg font-normal text-zinc-400 font-sans">%</span>
        </span>
        {label && <span className="text-xs font-medium text-zinc-400 mt-0.5">{label}</span>}
      </div>

      {sublabel && (
        <span className="text-xs text-zinc-400 mt-3 text-center">{sublabel}</span>
      )}
    </div>
  );
};
