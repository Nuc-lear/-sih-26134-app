import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { SkillGapResult } from '../types';

interface SkillGapChartProps {
  gaps: SkillGapResult[];
  onSkillClick?: (gap: SkillGapResult) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  gaps: SkillGapResult[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, gaps }) => {
  if (active && payload && payload.length && label) {
    const gapItem = gaps.find((g) => g.skill_name === label);
    return (
      <div className="bg-surface-elevated border border-surface-border p-3 rounded-lg shadow-xl text-xs space-y-1 font-sans">
        <p className="font-semibold text-white text-sm">{label}</p>
        <div className="flex items-center justify-between gap-4 text-zinc-300">
          <span>Required Benchmark:</span>
          <span className="font-mono font-medium text-sky-400">{payload[0]?.value}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-zinc-300">
          <span>Your Current Level:</span>
          <span className="font-mono font-medium text-emerald-400">{payload[1]?.value}%</span>
        </div>
        {gapItem && (
          <div className="pt-1 mt-1 border-t border-surface-border flex items-center justify-between gap-4">
            <span className="text-zinc-400">Calculated Gap:</span>
            <span className="font-mono font-bold text-rose-400">
              {gapItem.gap} pts ({gapItem.tier})
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ gaps, onSkillClick }) => {
  const chartData = gaps.map((item) => ({
    name: item.skill_name,
    Required: item.required_level,
    Current: item.student_level,
    rawGap: item,
  }));

  return (
    <div className="w-full bg-surface border border-surface-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Skill Repertoire vs. Industry Benchmark
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare your evaluated proficiency against role benchmark requirements
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            onClick={(data) => {
              if (data && data.activePayload && data.activePayload[0] && onSkillClick) {
                const clickedItem = data.activePayload[0].payload.rawGap as SkillGapResult;
                onSkillClick(clickedItem);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2433" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#232838' }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={45}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#232838' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip gaps={gaps} />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              dataKey="Required"
              name="Required Standard"
              fill="#38bdf8"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="Current"
              name="Current Proficiency"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
