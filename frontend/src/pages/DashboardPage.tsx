import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Sliders,
  FileText,
  AlertTriangle,
  ArrowRight,
  Calculator,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Target,
  FileCode,
  Cpu,
  Layers,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { MetricCard } from '../components/MetricCard';
import { RoleMatchCard } from '../components/RoleMatchCard';
import { SkillGapChart } from '../components/SkillGapChart';
import { RecommendationRow } from '../components/RecommendationRow';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { CalculationModal, CalculationPayload } from '../components/CalculationModal';
import { SkillGapResult, RecommendationItem } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    student,
    auditReport,
    isLoading,
    error,
    loadDemoSunny,
    setTargetRole,
    updateSkillLevel,
  } = useStudent();

  // State for calculation modal inspector
  const [calculationPayload, setCalculationPayload] = useState<CalculationPayload | null>(null);

  // State for live skill bump testing drawer
  const [isBumpDrawerOpen, setIsBumpDrawerOpen] = useState<boolean>(false);
  const [selectedSkillToBump, setSelectedSkillToBump] = useState<string>('Machine Learning');
  const [bumpValue, setBumpValue] = useState<number>(75);

  // State to toggle visibility of other matched roles (default: hidden, showing only selected target)
  const [showOtherRoles, setShowOtherRoles] = useState<boolean>(false);

  // If no student exists yet, show clear EmptyState with 1-click CTA
  if (!student) {
    return (
      <div className="py-16">
        <EmptyState
          title="No Active Student Profile"
          description="Start by entering your skill profile through the onboarding wizard, or load the seeded demo student (Sunny Ranjan) with a single click."
          actionText="Load Sunny Ranjan Demo Profile"
          onAction={() => loadDemoSunny()}
          icon={<Sparkles className="w-6 h-6 text-accent" />}
        />
      </div>
    );
  }

  if (error && !auditReport) {
    return (
      <div className="py-16">
        <ErrorState
          title="Intelligence Calculation Failed"
          message={error}
          onRetry={() => loadDemoSunny()}
        />
      </div>
    );
  }

  const targetRole = auditReport?.target_role;
  const targetMatch = auditReport?.role_matches.find(
    (m) => m.role_slug === targetRole?.slug
  );
  const otherMatches =
    auditReport?.role_matches.filter((m) => m.role_slug !== targetRole?.slug) || [];

  const criticalGapsCount =
    auditReport?.skill_gaps.filter((g) => g.tier === 'Critical Gap').length || 0;

  const topPriorities = auditReport?.priorities.slice(0, 3) || [];
  const topRecommendations = auditReport?.recommendations.slice(0, 3) || [];

  const handleApplySkillBump = async () => {
    await updateSkillLevel(selectedSkillToBump, bumpValue);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Transparency Modal */}
      <CalculationModal
        payload={calculationPayload}
        onClose={() => setCalculationPayload(null)}
      />

      {/* Ultra-Compact Top Header Bar (Reduced to Half Size) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-surface-border/40">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Skill Intelligence & Gap Diagnostic
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-surface-border text-[11px] text-zinc-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Target: <strong className="text-zinc-200">{targetRole?.title || 'AI/ML Engineer'}</strong></span>
            </span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              MVP Dataset
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">
            Comparing <strong className="text-zinc-200 font-medium">{student.full_name}</strong>'s evaluated skills against industry benchmarks. All scores mathematically computed.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsBumpDrawerOpen(!isBumpDrawerOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-zinc-950 hover:bg-accent-hover text-[11px] font-semibold transition-colors shadow-sm font-sans"
          >
            <Sliders className="w-3 h-3" />
            <span>Live Skill Bump</span>
          </button>
        </div>
      </div>

      {/* Live Skill Bump Inspector (Closing Demo Beat!) */}
      {isBumpDrawerOpen && (
        <div className="bg-surface-elevated border-2 border-accent/40 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-200 space-y-4 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Live Skill Re-Analysis Engine
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Increase a skill proficiency and watch role matches, gaps, and priorities recompute live in Python.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsBumpDrawerOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Select Skill to Bump
              </label>
              <select
                value={selectedSkillToBump}
                onChange={(e) => {
                  setSelectedSkillToBump(e.target.value);
                  const currentSkill = student.skills.find(
                    (s) => s.name.toLowerCase() === e.target.value.toLowerCase()
                  );
                  setBumpValue(currentSkill ? Math.min(100, currentSkill.proficiency_level + 30) : 75);
                }}
                className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
              >
                {student.skills.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} (Current: {s.proficiency_level}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-300">
                  New Proficiency
                </label>
                <span className="text-xs font-mono font-bold text-accent">
                  {bumpValue}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={bumpValue}
                onChange={(e) => setBumpValue(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleApplySkillBump}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Re-analyzing...' : 'Run Live Re-Analysis'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Diagnostic & Role Dock Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Metrics, Skill Gap Analysis & Priorities (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Top 4 Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <MetricCard
              title="Target Readiness"
              value={`${Math.round(auditReport?.readiness_score || 0)}%`}
              subtitle={`Targeted: ${targetRole?.title || 'Role'}`}
              icon={<Calculator className="w-4 h-4 text-accent" />}
              onClick={() => {
                if (targetMatch) {
                  setCalculationPayload({ type: 'match', data: targetMatch });
                }
              }}
            />
            <MetricCard
              title="Pre-Factor Match"
              value={`${Math.round(targetMatch?.skill_match_score || 0)}%`}
              subtitle="Direct weighted alignment"
              icon={<Sliders className="w-4 h-4 text-sky-400" />}
              onClick={() => {
                if (targetMatch) {
                  setCalculationPayload({ type: 'match', data: targetMatch });
                }
              }}
            />
            <MetricCard
              title="Education Factor"
              value={`×${(targetMatch?.education_factor || 1.0).toFixed(2)}`}
              subtitle={`${student.degree_field} Multiplier`}
              icon={<GraduationCap className="w-4 h-4 text-amber-400" />}
            />
            <MetricCard
              title="Critical Gaps"
              value={criticalGapsCount}
              subtitle="Deficits > 50 points"
              icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
            />
          </div>

          {/* Skill Gap Analysis Dual Bar Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Skill Gap Analysis</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-sky-400 border border-surface-border font-normal">
                    Target: {targetRole?.title || 'Benchmark'}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Comparing candidate proficiencies vs. requirements for <strong className="text-zinc-200">{targetRole?.title}</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                Click bar to inspect math
              </span>
            </div>

            <SkillGapChart
              gaps={auditReport?.skill_gaps || []}
              onSkillClick={(gap: SkillGapResult) =>
                setCalculationPayload({ type: 'gap', data: gap })
              }
            />
          </div>

          {/* Mathematically Prioritized Action Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Prioritized Focus Areas</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-accent border border-surface-border font-normal">
                    {targetRole?.title}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ranked by formula: (Gap / 100) × Market Demand × Role Importance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/priorities')}
                className="text-xs font-medium text-accent hover:text-accent-hover inline-flex items-center gap-1 transition-colors"
              >
                <span>View Full Priority Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topRecommendations.map((item: RecommendationItem) => (
                <RecommendationRow
                  key={item.skill_name}
                  item={item}
                  onViewRationale={() => {
                    const prio = topPriorities.find((p) => p.skill_name === item.skill_name);
                    if (prio) {
                      setCalculationPayload({ type: 'priority', data: prio });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Vertical Target Role & Switcher Dock (4 cols) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="bg-surface border border-surface-border rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            {/* ONLY the Selected Target Role Card is displayed */}
            {targetMatch ? (
              <div className="space-y-3">
                <RoleMatchCard
                  match={targetMatch}
                  isSelected={true}
                  onSelect={() => {}}
                  onViewCalculation={(selected) =>
                    setCalculationPayload({ type: 'match', data: selected })
                  }
                />
              </div>
            ) : targetRole ? (
              <div className="p-4 rounded-xl bg-surface-elevated border border-accent/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{targetRole.title}</h3>
                  <span className="text-xs font-mono font-bold text-accent">
                    {Math.round(auditReport?.readiness_score || 0)}%
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{targetRole.description}</p>
              </div>
            ) : null}

            {/* Rest of the options: Hidden by default, cleanly toggleable */}
            {otherMatches.length > 0 && (
              <div className="space-y-3 pt-1">
                {!showOtherRoles ? (
                  <button
                    type="button"
                    onClick={() => setShowOtherRoles(true)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated text-xs text-zinc-300 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>Switch Target Role ({otherMatches.length} options hidden)</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 group-hover:text-accent transition-colors flex items-center gap-1">
                      <span>Show</span>
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-surface-border/60">
                      <span className="text-zinc-400 font-medium">
                        Other Available Roles ({otherMatches.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowOtherRoles(false)}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1 font-mono"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Hide options</span>
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {otherMatches.map((m) => (
                        <RoleMatchCard
                          key={m.role_id}
                          match={m}
                          isSelected={false}
                          onSelect={(selected) => {
                            setTargetRole(selected.role_slug);
                            setShowOtherRoles(false);
                          }}
                          onViewCalculation={(selected) =>
                            setCalculationPayload({ type: 'match', data: selected })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other Options Box in the Vacant Space on Right Bottom */}
          <div className="bg-surface border border-surface-border rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-surface-border/70">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Other Options
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-zinc-400 border border-surface-border">
                Modules
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/roles"
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 hover:bg-surface-elevated border border-surface-border hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors truncate">
                      Role Requirements
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Benchmark standards & degree factors
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
              </Link>

              <Link
                to="/priorities"
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 hover:bg-surface-elevated border border-surface-border hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileCode className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors truncate">
                      Action Priorities
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Mathematical ROI ranking & roadmap
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
              </Link>

              <Link
                to="/report"
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 hover:bg-surface-elevated border border-surface-border hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors truncate">
                      AI Executive Brief
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Narrated analysis of computed scores
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
              </Link>

              <Link
                to="/extractor"
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 hover:bg-surface-elevated border border-surface-border hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors truncate">
                      Job Parser
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Extract skills from live job descriptions
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
