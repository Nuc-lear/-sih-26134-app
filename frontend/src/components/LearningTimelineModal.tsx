import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, CheckCircle2, ArrowRight, Target, Sparkles, Layers, Youtube } from 'lucide-react';
import { RecommendationItem } from '../types';
import { getTopYoutubeLectures } from './ResourceModal';

interface LearningTimelineModalProps {
  item: RecommendationItem;
  onClose: () => void;
}

interface TimelinePhase {
  phase_number: number;
  title: string;
  duration_weeks: string;
  hours_allocated: number;
  topics: string[];
  milestone: string;
}

export const getSkillTimelinePhases = (skillName: string, totalHours: number): TimelinePhase[] => {
  const s = skillName.toLowerCase().trim();
  const quarterHours = Math.round(totalHours / 4);

  if (s.includes('pandas')) {
    return [
      {
        phase_number: 1,
        title: 'Core Fundamentals & Data Structures',
        duration_weeks: 'Weeks 1 – 2',
        hours_allocated: quarterHours,
        topics: [
          'Series and DataFrame initialization & data types',
          'Indexing, slicing, loc/iloc selection mechanics',
          'Importing/exporting CSV, JSON, Excel, and Parquet files',
          'Handling missing values (dropna, fillna, interpolate)'
        ],
        milestone: 'Build a raw data ingestion & automated cleaning pipeline.'
      },
      {
        phase_number: 2,
        title: 'Data Transformation & Aggregations',
        duration_weeks: 'Weeks 3 – 4',
        hours_allocated: quarterHours,
        topics: [
          'GroupBy split-apply-combine operations',
          'Pivoting, melting, and multi-index stacking',
          'Merging, concatenating, and relational joins',
          'String operations and vectorization performance'
        ],
        milestone: 'Construct an automated analytics aggregation engine for multi-table datasets.'
      },
      {
        phase_number: 3,
        title: 'Time Series & Exploratory Analytics',
        duration_weeks: 'Weeks 5 – 6',
        hours_allocated: quarterHours,
        topics: [
          'Datetime parsing, resampling, and window rolling statistics',
          'Categorical data optimization and memory profiling',
          'Integration with Matplotlib/Seaborn visual telemetry',
          'Outlier detection and statistical distribution checks'
        ],
        milestone: 'Perform end-to-end Exploratory Data Analysis (EDA) on 1M+ row dataset.'
      },
      {
        phase_number: 4,
        title: 'Production Capstone & Optimization',
        duration_weeks: 'Weeks 7 – 8',
        hours_allocated: totalHours - (quarterHours * 3),
        topics: [
          'Memory reduction using category types and chunking',
          'Vectorized custom functions vs apply performance',
          'Exporting clean features for Machine Learning pipelines',
          'Documenting EDA notebook & publishing GitHub capstone'
        ],
        milestone: 'Deploy a production-ready Pandas feature engineering script with full documentation.'
      }
    ];
  }

  if (s.includes('numpy')) {
    return [
      {
        phase_number: 1,
        title: 'Array Mechanics & Memory Layout',
        duration_weeks: 'Weeks 1 – 2',
        hours_allocated: quarterHours,
        topics: [
          'ndarray creation, shapes, strides, and dtypes',
          'Broadcasting rules and multi-dimensional indexing',
          'Vectorized arithmetic vs Python loop benchmarking',
          'Slicing vs copying memory buffers'
        ],
        milestone: 'Write benchmark scripts comparing NumPy vectorized ops against pure Python.'
      },
      {
        phase_number: 2,
        title: 'Matrix Operations & Linear Algebra',
        duration_weeks: 'Weeks 3 – 4',
        hours_allocated: quarterHours,
        topics: [
          'Matrix multiplication (dot, inner, einsum)',
          'Eigenvalues, SVD, and matrix decompositions',
          'Solving linear equations using numpy.linalg',
          'Random number sampling and seed management'
        ],
        milestone: 'Implement a linear regression model using pure NumPy matrix equations.'
      },
      {
        phase_number: 3,
        title: 'Advanced Manipulation & Masking',
        duration_weeks: 'Weeks 5 – 6',
        hours_allocated: quarterHours,
        topics: [
          'Boolean indexing and fancy integer indexing',
          'Structured arrays and record arrays',
          'Universal functions (ufuncs) and custom C-extensions',
          'Fourier transforms (np.fft) and signal filtering'
        ],
        milestone: 'Build an image processing / matrix filter module using NumPy arrays.'
      },
      {
        phase_number: 4,
        title: 'Applied Engineering Capstone',
        duration_weeks: 'Weeks 7 – 8',
        hours_allocated: totalHours - (quarterHours * 3),
        topics: [
          'Integrating NumPy buffers with PyTorch/TensorFlow Tensors',
          'Memory-mapped files (np.memmap) for large datasets',
          'Publishing tested code module with PyTest suite',
          'GitHub portfolio presentation'
        ],
        milestone: 'Complete custom numerical solver library published on GitHub.'
      }
    ];
  }

  // Generic Skill Roadmap Generator
  return [
    {
      phase_number: 1,
      title: `Phase 1: ${skillName} Core Fundamentals`,
      duration_weeks: 'Weeks 1 – 2',
      hours_allocated: quarterHours,
      topics: [
        `Understand core concepts, architecture, and syntax of ${skillName}`,
        'Setup local development environment and CLI tooling',
        'Complete basic exercises and foundational code examples',
        'Learn standard debugging workflows and error handling'
      ],
      milestone: `Build initial starter project utilizing core ${skillName} features.`
    },
    {
      phase_number: 2,
      title: `Phase 2: Intermediate Patterns & Real Projects`,
      duration_weeks: 'Weeks 3 – 4',
      hours_allocated: quarterHours,
      topics: [
        `Master common design patterns and best practices in ${skillName}`,
        'Integrate third-party libraries and API interfaces',
        'Implement automated testing and validation routines',
        'Optimize execution speed and resource efficiency'
      ],
      milestone: `Construct a multi-module working application with full unit test coverage.`
    },
    {
      phase_number: 3,
      title: `Phase 3: Advanced Optimization & Industry Use Cases`,
      duration_weeks: 'Weeks 5 – 6',
      hours_allocated: quarterHours,
      topics: [
        `Deep dive into advanced topics, memory management, and edge cases in ${skillName}`,
        'Refactor existing codebase for clean architecture principles',
        'Perform performance benchmarking and security profiling',
        'Build real-world production features matching market standards'
      ],
      milestone: `Demonstrate enterprise-grade implementation with zero regression errors.`
    },
    {
      phase_number: 4,
      title: `Phase 4: Applied Capstone Portfolio & Deployment`,
      duration_weeks: 'Weeks 7 – 8',
      hours_allocated: totalHours - (quarterHours * 3),
      topics: [
        `Package ${skillName} capstone project for public review`,
        'Write comprehensive README documentation and setup guide',
        'Publish repository to GitHub and record video demonstration',
        'Review target market requirements and prepare interview prep'
      ],
      milestone: `Live GitHub portfolio project proving ${skillName} industry readiness.`
    }
  ];
};

export const LearningTimelineModal: React.FC<LearningTimelineModalProps> = ({ item, onClose }) => {
  const [pace, setPace] = useState<'standard' | 'intensive'>('standard');
  const phases = getSkillTimelinePhases(item.skill_name, item.estimated_hours);
  const lectures = getTopYoutubeLectures(item.skill_name);
  const topLecture = lectures[0];

  const weeklyHours = pace === 'standard' ? 20 : 40;
  const estimatedWeeks = Math.ceil(item.estimated_hours / weeklyHours);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface border border-surface-border rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Structured Learning Timeline: {item.skill_name}
              </h2>
              <span className="text-xs font-mono font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                {item.priority_tier}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Step-by-step breakdown of your <strong className="text-zinc-200">~{item.estimated_hours} total hours</strong> target gap closure.
            </p>
          </div>
        </div>

        {/* Learning Schedule Pace Controls */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Pace Estimation ({item.estimated_hours} Total Hours)</span>
            </span>
            <span className="text-xs text-zinc-400 block">
              Estimated duration at selected commitment: <strong className="text-accent font-mono">{estimatedWeeks} Weeks</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-surface-border shrink-0">
            <button
              type="button"
              onClick={() => setPace('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                pace === 'standard'
                  ? 'bg-accent text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Standard (20h/wk)
            </button>
            <button
              type="button"
              onClick={() => setPace('intensive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                pace === 'intensive'
                  ? 'bg-accent text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Intensive (40h/wk)
            </button>
          </div>
        </div>

        {/* Recommended Free Video Course Banner */}
        {topLecture && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Youtube className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  Recommended Course: {topLecture.title}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {topLecture.channel} · {topLecture.duration} · ★ {topLecture.rating}
                </span>
              </div>
            </div>
            <a
              href={topLecture.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shrink-0 transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              <span>Watch Tutorial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Phase-by-Phase Roadmap Timeline */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono tracking-wider">
            <Layers className="w-4 h-4 text-accent" />
            <span>4-Phase Milestone Learning Roadmap</span>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => (
              <div
                key={phase.phase_number}
                className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-3 hover:border-accent/40 transition-colors relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {phase.phase_number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {phase.title}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {phase.duration_weeks} ({phase.hours_allocated} Hours)
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-semibold shrink-0">
                    ~{phase.hours_allocated} hrs
                  </span>
                </div>

                {/* Key Topics List */}
                <div className="space-y-1.5 pl-8">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Core Learning Objectives:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-300">
                    {phase.topics.map((t, tidx) => (
                      <li key={tidx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase Deliverable Milestone */}
                <div className="ml-8 p-2.5 rounded-lg bg-surface border border-surface-border text-xs flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Phase Deliverable: </span>
                    <span className="text-zinc-300">{phase.milestone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 flex items-center justify-between text-xs text-zinc-500 border-t border-surface-border">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Deterministic timeline calculated for {item.skill_name} (~{item.estimated_hours}h total)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface-elevated border border-surface-border text-white hover:bg-surface-hover font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
