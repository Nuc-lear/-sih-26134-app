import { useState } from 'react';
import { ShieldCheck, Calculator, Sparkles, Youtube } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { PriorityBadge } from '../components/PriorityBadge';
import { CalculationModal, CalculationPayload } from '../components/CalculationModal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { PriorityResult } from '../types';
import { CareerRoleSelector } from '../components/CareerRoleSelector';
import { ResourceModal } from '../components/ResourceModal';

export const PrioritiesPage: React.FC = () => {
  const {
    auditReport,
    student,
    isLoading,
    loadDemoAarav,
    targetRoleSlug,
    setTargetRole,
  } = useStudent();
  const [calculationPayload, setCalculationPayload] = useState<CalculationPayload | null>(null);
  const [selectedResourceSkill, setSelectedResourceSkill] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingState
          message="Calculating mathematical priority rankings..."
          submessage="Weighing skill deficits against market hiring volume and role criticality"
        />
      </div>
    );
  }

  if (!student || !auditReport) {
    return (
      <div className="py-16">
        <EmptyState
          title="No Priority Analysis Available"
          description="You have not loaded or created a student profile yet. Load the seeded demo profile or complete onboarding to inspect mathematical priority rankings."
          actionText="Load Aarav Sharma Demo"
          onAction={() => loadDemoAarav()}
          icon={<Sparkles className="w-6 h-6 text-accent" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <CalculationModal
        payload={calculationPayload}
        onClose={() => setCalculationPayload(null)}
      />

      <div className="bg-surface border border-surface-border rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface-elevated border border-surface-border text-xs text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deterministic Priority Engine</span>
            <span className="text-zinc-600">|</span>
            <span className="text-accent font-mono text-[11px] font-semibold">
              Target: {auditReport.target_role?.title}
            </span>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Mathematical Skill Priority Matrix
        </h1>
        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
          Every skill deficit mathematically ranked for <strong className="text-zinc-200">{auditReport.target_role?.title}</strong>.
        </p>
      </div>

      {/* Single Box Career Role Selector */}
      <CareerRoleSelector
        roleMatches={auditReport.role_matches}
        targetRoleSlug={targetRoleSlug}
        onSelectRole={setTargetRole}
        titleLabel="Target Benchmark"
        subtitleLabel="Switch role to recompute priority matrix"
      />

      {/* Priority Table */}
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-surface-border text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Rank & Skill</th>
                <th className="py-3.5 px-4 font-medium">Deficit (Gap)</th>
                <th className="py-3.5 px-4 font-medium">Market Demand</th>
                <th className="py-3.5 px-4 font-medium">Role Criticality</th>
                <th className="py-3.5 px-4 font-medium">Priority Score</th>
                <th className="py-3.5 px-4 font-medium">Tier</th>
                <th className="py-3.5 px-4 font-medium text-center">Inspect</th>
                <th className="py-3.5 px-4 font-medium text-right">Top Lectures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {auditReport.priorities.map((item: PriorityResult, idx: number) => (
                <tr
                  key={item.skill_name}
                  className="hover:bg-surface-elevated/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    <span className="text-zinc-500 mr-2 font-mono">#{idx + 1}</span>
                    {item.skill_name}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-rose-400">
                    {item.gap} pts
                  </td>
                  <td className="py-3 px-4 font-mono text-sky-400">
                    {item.industry_demand.toFixed(1)}/10
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400">
                    {item.role_importance.toFixed(1)}/10
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                    {item.priority_score.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge tier={item.priority_tier} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setCalculationPayload({ type: 'priority', data: item })}
                      className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>Math</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedResourceSkill(item.skill_name)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors shadow-sm"
                    >
                      <Youtube className="w-3.5 h-3.5 fill-rose-400" />
                      <span>Top Lectures</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Rated YouTube Lectures Modal */}
      {selectedResourceSkill && (
        <ResourceModal
          skillName={selectedResourceSkill}
          onClose={() => setSelectedResourceSkill(null)}
        />
      )}
    </div>
  );
};
