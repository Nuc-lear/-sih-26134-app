import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Target } from 'lucide-react';
import { api } from '../services/api';
import { ExtractedSkill } from '../types';
import { useStudent } from '../context/StudentContext';
import { LoadingState } from '../components/LoadingState';

interface RolePreset {
  slug: string;
  title: string;
  shortDesc: string;
  jd: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    slug: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    shortDesc: 'ML, Deep Learning, Python, Stats',
    jd: `We are seeking an AI/ML Engineer to build, train, and deploy predictive systems.
Requirements:
- Strong programming fundamentals in Python and SQL
- Hands-on experience with Machine Learning algorithms and Deep Learning frameworks (PyTorch or TensorFlow)
- Solid foundation in Linear Algebra, Probability, and Statistics
- Familiarity with data manipulation libraries like Pandas and NumPy
- Experience building REST APIs and version control with Git`,
  },
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    shortDesc: 'React, TypeScript, JavaScript, CSS',
    jd: `Looking for a skilled Frontend Developer to build responsive, high-performance web applications.
Requirements:
- Core mastery of modern JavaScript, TypeScript, HTML, and CSS
- Strong component architecture experience with React
- Hands-on implementation of Responsive Design across diverse screen viewports
- Experience consuming REST APIs and client-side data state
- Familiarity with version control using Git and collaborative PR workflows`,
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    shortDesc: 'Python, SQL, REST APIs, Databases',
    jd: `Looking for a Backend Developer with 1-2 years experience to architect reliable web services.
Requirements:
- High proficiency in Python, Java, or C++ for server-side logic
- Strong SQL and relational database design and optimization
- Experience designing and consuming scalable, secure REST APIs
- Understanding of System Design principles and database architectures
- Version control proficiency with Git in distributed teams`,
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    shortDesc: 'SQL, Python, Visualization, Excel',
    jd: `We are hiring a Data Analyst to extract business intelligence and build executive dashboards.
Requirements:
- Advanced SQL for data extraction, aggregations, and joins
- Proficiency in Python and data manipulation with Pandas
- Solid understanding of Applied Statistics and quantitative analytical methods
- Hands-on experience with Data Visualization tools, Excel, and Power BI
- Clear business communication skills and experience with Git`,
  },
];

export const JobExtractorPage: React.FC = () => {
  const { student, targetRoleSlug, setTargetRole, auditReport } = useStudent();

  const currentPreset =
    ROLE_PRESETS.find((p) => p.slug === targetRoleSlug) || ROLE_PRESETS[0];

  const [rawText, setRawText] = useState<string>(currentPreset.jd);
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string>(targetRoleSlug);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Synchronize preset text when targetRoleSlug changes from Dashboard or navigation
  useEffect(() => {
    setSelectedPresetSlug(targetRoleSlug);
    const preset = ROLE_PRESETS.find((p) => p.slug === targetRoleSlug);
    if (preset) {
      setRawText(preset.jd);
      setExtractedSkills([]);
    }
  }, [targetRoleSlug]);

  const handleSelectRolePreset = (preset: RolePreset) => {
    setSelectedPresetSlug(preset.slug);
    setRawText(preset.jd);
    setExtractedSkills([]);
    setTargetRole(preset.slug);
  };

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    setError(null);
    try {
      const res = await api.extractJobSkills(rawText);
      setExtractedSkills(res.extracted_skills);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Skill extraction failed.';
      setError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  // Check which skills are required in the currently active target role
  const targetRoleSkillNames = new Set(
    (auditReport?.target_role?.skills || []).map((s) => s.name.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>LLM Structured Parser Layer</span>
          <span className="text-zinc-600">|</span>
          <span className="text-sky-400 font-mono text-[11px]">
            Target: {auditReport?.target_role?.title || currentPreset.title}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Job Description Skill Extractor
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
          Paste any unstructured job posting or select an industry benchmark below. The parser extracts canonical skills with confidence scores, comparing them against <span className="text-zinc-200 font-medium">{student?.full_name || 'your profile'}</span> and the active benchmark role.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="bg-surface border border-surface-border rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase font-mono tracking-wider">
            <Target className="w-4 h-4 text-accent" />
            <span>Select Benchmark Role JD Preset</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Synchronizes with Dashboard
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROLE_PRESETS.map((preset) => {
            const isActive = selectedPresetSlug === preset.slug;
            return (
              <button
                key={preset.slug}
                type="button"
                onClick={() => handleSelectRolePreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-accent bg-surface-elevated ring-2 ring-accent/30 shadow-md'
                    : 'border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isActive ? 'text-accent' : 'text-white'}`}>
                    {preset.title}
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1 line-clamp-1">
                  {preset.shortDesc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
            Raw Job Description ({auditReport?.target_role?.title || currentPreset.title})
          </label>
          <span className="text-[11px] text-zinc-400">
            Edit text freely or run extraction on preset
          </span>
        </div>

        <textarea
          rows={7}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw job description here..."
          className="w-full bg-surface-elevated border border-surface-border rounded-xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-500 font-mono">
            {rawText.length} characters
          </span>
          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting || !rawText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover font-semibold text-xs transition-all shadow-md font-sans disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExtracting ? 'Parsing Structured JSON...' : 'Extract & Match Skills'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State during parsing */}
      {isExtracting && (
        <div className="py-8">
          <LoadingState
            message="Parsing unstructured job description..."
            submessage="Identifying canonical engineering skills and calculating normalization confidence"
          />
        </div>
      )}

      {/* Extracted Skills List */}
      {extractedSkills.length > 0 && (
        <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Extracted & Normalized Skills ({extractedSkills.length})
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Matched against candidate profile & benchmark: <strong className="text-zinc-200">{auditReport?.target_role?.title || currentPreset.title}</strong>
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Strict Schema Validated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extractedSkills.map((item: ExtractedSkill) => {
              const studentSkill = student?.skills.find(
                (s) => s.name.toLowerCase() === item.normalized_name.toLowerCase()
              );
              const studentHasSkill = Boolean(studentSkill);
              const isRequiredInRole = targetRoleSkillNames.has(
                item.normalized_name.toLowerCase()
              );

              return (
                <div
                  key={item.normalized_name}
                  className="p-3 bg-surface-elevated border border-surface-border rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white block">
                        {item.normalized_name}
                      </span>
                      {isRequiredInRole && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                          Role Req
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono block">
                      Confidence: {(item.confidence * 100).toFixed(0)}% · {item.category}
                    </span>
                  </div>

                  <div className="text-right">
                    {studentHasSkill ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        In Profile ({studentSkill?.proficiency_level}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                        Missing from Profile
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
