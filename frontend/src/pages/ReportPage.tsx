import React, { useState } from 'react';
import { FileText, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { api } from '../services/api';
import { NarrationResponse } from '../types';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { CareerRoleSelector } from '../components/CareerRoleSelector';

export const ReportPage: React.FC = () => {
  const { student, auditReport, loadDemoSunny, targetRoleSlug, setTargetRole } = useStudent();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [narration, setNarration] = useState<NarrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!student || !auditReport) {
    return (
      <div className="py-16">
        <EmptyState
          title="No Profile for Report Generation"
          description="Load or create a student profile to generate the executive career intelligence brief."
          actionText="Load Sunny Ranjan Demo"
          onAction={() => loadDemoSunny()}
          icon={<FileText className="w-6 h-6 text-accent" />}
        />
      </div>
    );
  }

  const targetRole = auditReport.target_role;
  const targetMatch = auditReport.role_matches.find((m) => m.role_slug === targetRole.slug);

  const handleGenerateNarration = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const topStrengths = auditReport.skill_gaps
        .filter((g) => g.tier === 'Strong')
        .map((g) => `${g.skill_name} (${g.student_level}%)`);

      const topGaps = auditReport.skill_gaps
        .filter((g) => g.tier === 'Critical Gap' || g.tier === 'Major Gap')
        .slice(0, 3)
        .map((g) => `${g.skill_name} (Gap: ${g.gap} pts)`);

      const topPriorities = auditReport.priorities
        .slice(0, 3)
        .map((p) => `${p.skill_name} (Score: ${p.priority_score.toFixed(2)})`);

      const response = await api.narrateReport({
        student_name: student.full_name,
        degree_field: student.degree_field,
        target_role_title: targetRole.title,
        match_score: targetMatch?.final_score || 0,
        readiness_score: auditReport.readiness_score,
        top_strengths: topStrengths,
        top_gaps: topGaps,
        top_priorities: topPriorities,
      });

      setNarration(response);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Narration failed.';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs text-zinc-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Narration Layer (Zero Scoring Authority)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Executive Career Intelligence Brief
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            The AI acts solely as an analytical narrator of pre-computed mathematical figures.
            It never invents numbers, salaries, or rankings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateNarration}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover text-xs font-semibold transition-all shadow-lg hover:shadow-accent/20 shrink-0 font-sans disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Narrative...' : 'Synthesize AI Brief'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Single Box Career Role Selector */}
      <CareerRoleSelector
        roleMatches={auditReport.role_matches}
        targetRoleSlug={targetRoleSlug}
        onSelectRole={(slug) => {
          setTargetRole(slug);
          setNarration(null);
        }}
        titleLabel="Target Benchmark"
        subtitleLabel="Switch role to generate new executive brief"
      />

      {/* Report Container */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-sm leading-relaxed">
        {/* Student & Role Anchor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-elevated border border-surface-border rounded-xl font-mono text-center">
          <div>
            <span className="text-[11px] text-zinc-400 font-sans block">Candidate</span>
            <span className="font-bold text-white text-xs">{student.full_name}</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-sans block">Major</span>
            <span className="font-bold text-white text-xs">{student.degree_field}</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-sans block">Target Role</span>
            <span className="font-bold text-sky-400 text-xs">{targetRole.title}</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-sans block">Computed Readiness</span>
            <span className="font-bold text-emerald-400 text-xs">{Math.round(auditReport.readiness_score)}%</span>
          </div>
        </div>

        {/* Narrative Sections */}
        {narration ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                1. Executive Summary
              </h3>
              <p className="text-zinc-200 bg-surface-elevated p-4 rounded-xl border border-surface-border">
                {narration.executive_summary}
              </p>
            </div>

            {/* Strengths & Bottlenecks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Validated Strengths
                </h4>
                <p className="text-xs text-zinc-300">{narration.strengths}</p>
              </div>

              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 font-mono uppercase">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Critical Bottlenecks
                </h4>
                <p className="text-xs text-zinc-300">{narration.bottlenecks}</p>
              </div>
            </div>

            {/* 3-Step Roadmap */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                2. Prioritized 3-Step Milestone Roadmap
              </h3>
              <div className="space-y-2">
                {narration.roadmap.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-surface-elevated border border-surface-border rounded-xl flex items-start gap-3 text-xs text-zinc-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing Note */}
            <div className="p-4 bg-surface-elevated border border-surface-border rounded-xl text-xs text-zinc-400 italic">
              "{narration.closing_note}"
            </div>
          </div>
        ) : isGenerating ? (
          <div className="py-8">
            <LoadingState
              message="Synthesizing AI executive career brief..."
              submessage="Translating deterministic Python metrics into an actionable narrative"
            />
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-400 space-y-3">
            <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs max-w-sm mx-auto">
              Click <span className="text-white font-medium">Synthesize AI Brief</span> above to generate
              the executive narration explaining your pre-computed readiness numbers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
