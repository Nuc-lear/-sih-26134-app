import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sparkles,
  Sliders,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Key,
  Cpu,
  Check,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { SkillInput, PredictedMarketRole } from '../types';
import { api } from '../services/api';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

const DEGREE_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Artificial Intelligence',
  'Mathematics and Computing',
  'Statistics',
  'Electronics and Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other STEM',
  'Non-STEM',
];

const CANONICAL_SKILL_SUGGESTIONS = [
  'Python',
  'SQL',
  'JavaScript',
  'TypeScript',
  'React',
  'Git',
  'Machine Learning',
  'Statistics',
  'Linear Algebra',
  'Deep Learning',
  'Pandas',
  'NumPy',
  'REST APIs',
  'System Design',
  'Data Visualization',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveStudentProfile, loadDemoAarav, isLoading } = useStudent();

  const [step, setStep] = useState<number>(1);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>('ai-ml-engineer');
  const [predictedRoles, setPredictedRoles] = useState<PredictedMarketRole[]>([]);
  const [isPredictingRoles, setIsPredictingRoles] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [aiEngineUsed, setAiEngineUsed] = useState<string>('Intelligent Semantic Engine (Calibrated)');
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('nexmind_gemini_key') || '');
  const [isKeyInputOpen, setIsKeyInputOpen] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(() => localStorage.getItem('nexmind_gemini_key') || '');

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [degreeField, setDegreeField] = useState<string>('Computer Science');
  const [educationLevel, setEducationLevel] = useState<string>('Undergraduate');
  const [currentYear, setCurrentYear] = useState<number>(2);
  const [skills, setSkills] = useState<SkillInput[]>([
    { name: 'Python', proficiency_level: 60 },
    { name: 'SQL', proficiency_level: 50 },
    { name: 'Git', proficiency_level: 40 },
  ]);
  const [newSkillName, setNewSkillName] = useState<string>('');

  // Fetch dynamic predicted roles if entering Step 3
  useEffect(() => {
    if (step === 3 && predictedRoles.length === 0 && !isPredictingRoles) {
      fetchPredictedRoles();
    }
  }, [step]);

  // Handler to load Aarav Sharma's pre-seeded benchmark
  const handleLoadAaravPreset = async () => {
    try {
      const demo = await api.getDemoAarav();
      setFullName(demo.full_name);
      setDegreeField(demo.degree_field);
      setEducationLevel(demo.education_level);
      setCurrentYear(demo.current_year_of_study);
      setSkills(demo.skills);
      setSelectedRoleSlug('ai-ml-engineer');
    } catch {
      // Fallback manual preset
      setFullName('Aarav Sharma');
      setDegreeField('Computer Science');
      setCurrentYear(2);
      setSkills([
        { name: 'Python', proficiency_level: 70 },
        { name: 'C++', proficiency_level: 65 },
        { name: 'JavaScript', proficiency_level: 40 },
        { name: 'React', proficiency_level: 25 },
        { name: 'SQL', proficiency_level: 60 },
        { name: 'Git', proficiency_level: 30 },
        { name: 'Statistics', proficiency_level: 45 },
        { name: 'Machine Learning', proficiency_level: 20 },
        { name: 'Linear Algebra', proficiency_level: 55 },
      ]);
    }
  };

  const handle1ClickDemo = async () => {
    await loadDemoAarav();
    navigate('/dashboard');
  };

  const handleAddSkill = (skillNameToAdd?: string) => {
    const name = (skillNameToAdd || newSkillName).trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    setSkills([...skills, { name, proficiency_level: 50 }]);
    setNewSkillName('');
  };

  const handleUpdateSkill = (index: number, level: number) => {
    const updated = [...skills];
    updated[index].proficiency_level = level;
    setSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const fetchPredictedRoles = async (customSkills?: SkillInput[], overrideKey?: string) => {
    setIsPredictingRoles(true);
    setPredictionError(null);
    try {
      const activeSkills = customSkills || skills;
      const keyToUse = overrideKey !== undefined ? overrideKey : customApiKey;
      const res = await api.predictTopRoles({
        skills: activeSkills,
        degreeField,
        studentName: fullName.trim() || 'Candidate',
        apiKey: keyToUse.trim() || undefined,
      });
      setPredictedRoles(res.predicted_roles);
      if (res.ai_engine_used) {
        setAiEngineUsed(res.ai_engine_used);
      }
      if (res.predicted_roles.length > 0) {
        setSelectedRoleSlug(res.predicted_roles[0].slug);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to predict market roles.';
      setPredictionError(msg);
    } finally {
      setIsPredictingRoles(false);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setCustomApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('nexmind_gemini_key', trimmed);
    } else {
      localStorage.removeItem('nexmind_gemini_key');
    }
    setIsKeyInputOpen(false);
    fetchPredictedRoles(skills, trimmed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    await saveStudentProfile(
      {
        full_name: fullName.trim(),
        education_level: educationLevel,
        degree_field: degreeField,
        graduation_year: 2026,
        current_year_of_study: currentYear,
        skills,
      },
      selectedRoleSlug
    );

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Right Toppest Corner: Minimized Vertical Theme Switcher */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeSwitcher />
      </div>

      <div className="max-w-3xl w-full mx-auto space-y-8">
        {/* Header with 1-Click Demo CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-surface-border text-xs text-zinc-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIH26134 · Team NEXMIND</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Student Profile Onboarding
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Deterministic career intelligence engine. AI explains, Python calculates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handle1ClickDemo}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/20 shrink-0 font-sans"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Demo (Aarav Sharma)</span>
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 1, label: 'About You', icon: User },
            { id: 2, label: 'Skill Matrix', icon: Sliders },
            { id: 3, label: 'Target Role', icon: Compass },
          ].map((s) => {
            const Icon = s.icon;
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-surface-elevated border-accent text-white shadow-md'
                    : isDone
                    ? 'bg-surface border-surface-border text-zinc-300'
                    : 'bg-surface/50 border-surface-border/50 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-accent' : isDone ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span className="text-xs font-medium">{s.label}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Personal & Academic Foundation</h2>
                  <p className="text-xs text-zinc-400">Used to compute deterministic education factor multipliers.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadAaravPreset}
                  className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-4 transition-colors"
                >
                  Fill Aarav's Data
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-zinc-600 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Degree Field / Major
                    </label>
                    <select
                      value={degreeField}
                      onChange={(e) => setDegreeField(e.target.value)}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors font-sans"
                    >
                      {DEGREE_OPTIONS.map((deg) => (
                        <option key={deg} value={deg} className="bg-surface text-white">
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Current Year of Study
                    </label>
                    <select
                      value={currentYear}
                      onChange={(e) => setCurrentYear(Number(e.target.value))}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors font-sans"
                    >
                      <option value={1} className="bg-surface text-white">1st Year</option>
                      <option value={2} className="bg-surface text-white">2nd Year</option>
                      <option value={3} className="bg-surface text-white">3rd Year</option>
                      <option value={4} className="bg-surface text-white">4th Year (Final)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Academic Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors font-sans"
                  >
                    <option value="Undergraduate" className="bg-surface text-white">Undergraduate (B.Tech / B.Sc / BCA)</option>
                    <option value="Postgraduate" className="bg-surface text-white">Postgraduate (M.Tech / M.Sc / MCA)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!fullName.trim()}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  <span>Continue to Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SKILL MATRIX */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Self-Evaluated Skill Repertoire</h2>
                  <p className="text-xs text-zinc-400">Score each skill on a scale from 0 to 100.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadAaravPreset}
                  className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-4 transition-colors"
                >
                  Load Aarav's 9 Skills
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-2 font-mono">
                  Quick Add Suggested Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CANONICAL_SKILL_SUGGESTIONS.map((name) => {
                    const isAdded = skills.some((s) => s.name.toLowerCase() === name.toLowerCase());
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleAddSkill(name)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                          isAdded
                            ? 'bg-surface-elevated border-zinc-700 text-zinc-500 cursor-not-allowed'
                            : 'bg-surface hover:bg-surface-elevated border-surface-border text-zinc-300 hover:text-white'
                        }`}
                      >
                        + {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Sliders List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="p-3 bg-surface-elevated border border-surface-border rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="w-36 shrink-0">
                      <span className="text-xs font-semibold text-white block truncate">
                        {skill.name}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={skill.proficiency_level}
                        onChange={(e) => handleUpdateSkill(index, Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                      <span className="w-10 text-right text-xs font-mono font-bold text-accent">
                        {skill.proficiency_level}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Add custom skill (e.g. Docker, Rust)..."
                  className="flex-1 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-surface-border hover:border-zinc-700 text-zinc-200 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(3);
                    fetchPredictedRoles();
                  }}
                  disabled={skills.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predict Top 10 Target Roles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI DYNAMIC TARGET ROLE PREDICTION */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-white">Top 10 Target Market Roles</h2>
                    <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
                      <Cpu className="w-3 h-3 text-emerald-400" />
                      <span>{aiEngineUsed}</span>
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Evaluated your {skills.length} skills against 2026 tech market demands. Select your target role to launch your gap diagnostic.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsKeyInputOpen(!isKeyInputOpen)}
                    className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-elevated transition-colors"
                    title="Configure custom Gemini API key for live LLM role prediction"
                  >
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>{customApiKey ? 'Gemini Key Configured' : 'Gemini Key (Optional)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchPredictedRoles()}
                    disabled={isPredictingRoles}
                    className="text-xs text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors disabled:opacity-50"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Re-Predict Roles</span>
                  </button>
                </div>
              </div>

              {/* Optional Gemini API Key Drawer */}
              {isKeyInputOpen && (
                <div className="p-4 rounded-xl bg-surface-elevated/80 border border-amber-500/30 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <h4 className="text-xs font-semibold text-white">Google Gemini API Key (Optional)</h4>
                    </div>
                    <span className="text-[10px] text-zinc-400">Stored safely in browser localStorage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="AIzaSy... (leave empty for intelligent semantic engine)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-surface border border-surface-border text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent text-zinc-950 hover:bg-accent-hover transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save & Predict</span>
                    </button>
                    {customApiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempApiKey('');
                          setCustomApiKey('');
                          localStorage.removeItem('nexmind_gemini_key');
                          setIsKeyInputOpen(false);
                          fetchPredictedRoles(skills, '');
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    If no key is provided, the platform seamlessly uses our zero-AI, calibrated semantic engine with full deterministic accuracy.
                  </p>
                </div>
              )}

              {/* Prediction Error Alert */}
              {predictionError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between gap-3">
                  <span>{predictionError}</span>
                  <button
                    type="button"
                    onClick={() => fetchPredictedRoles()}
                    className="underline text-accent hover:text-white"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading / AI Prediction Scanning State */}
              {isPredictingRoles && (
                <div className="p-8 rounded-2xl bg-surface-elevated/70 border border-surface-border text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin duration-1000" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">
                      Scanning Tech Market & Analyzing Skill Fit...
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                      Synthesizing top 10 targeted job roles matching your {skills.length} evaluated skills ({skills.map((s) => s.name).slice(0, 4).join(', ')}...) and {degreeField} major.
                    </p>
                  </div>
                </div>
              )}

              {/* Top 10 Predicted Roles Grid */}
              {!isPredictingRoles && predictedRoles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[540px] overflow-y-auto pr-1">
                  {predictedRoles.map((role, idx) => {
                    const isSelected = selectedRoleSlug === role.slug;
                    const fitBadgeClass =
                      role.fit_level === 'High Fit'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : role.fit_level === 'Strong Potential'
                        ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                    return (
                      <div
                        key={role.slug}
                        onClick={() => setSelectedRoleSlug(role.slug)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 text-left ${
                          isSelected
                            ? 'bg-surface-elevated border-accent ring-2 ring-accent/30 shadow-lg'
                            : 'bg-surface hover:bg-surface-elevated border-surface-border'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-elevated border border-surface-border text-zinc-400">
                                #{idx + 1}
                              </span>
                              <span className="text-sm font-bold text-white truncate">
                                {role.title}
                              </span>
                            </div>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border inline-block font-mono ${fitBadgeClass}`}>
                              {role.fit_level} · {role.match_percentage.toFixed(1)}% Match
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono font-bold text-sky-400">
                              {role.industry_demand.toFixed(1)}/10
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono block">Demand</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-accent mt-1 ml-auto" />}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                          {role.description}
                        </p>

                        {/* Core Skills Chips */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {role.core_skills.map((skillName) => (
                            <span
                              key={skillName}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated border border-surface-border text-zinc-300 font-mono"
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>

                        {/* Dynamic AI Synergy Rationale */}
                        <div className="pt-2 border-t border-surface-border/70 text-[11px] text-zinc-400 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-snug">{role.why_match}</span>
                        </div>

                        {/* Market Outlook */}
                        <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-0.5">
                          <span>{role.market_outlook}</span>
                          <span className={isSelected ? 'text-accent font-semibold' : 'text-zinc-400'}>
                            {isSelected ? '✓ Selected Benchmark' : 'Click to Target'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Skill Matrix</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isPredictingRoles || predictedRoles.length === 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
                >
                  <span>
                    {isLoading
                      ? 'Computing Analysis...'
                      : `Launch Intelligence Engine with ${
                          predictedRoles.find((r) => r.slug === selectedRoleSlug)?.title || 'Target Role'
                        }`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
